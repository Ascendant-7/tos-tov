import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { SupabaseService } from '../../supabase/supabase.service'
import type { Database, SupabaseClient } from '@repo/supabase'

@Injectable()
export class FriendService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get db(): SupabaseClient<Database> {
    return this.supabaseService.adminClient
  }

  private async getUserIdFromToken(accessToken: string) {
    const { data, error } = await this.supabaseService.anonClient.auth.getUser(accessToken)

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired access token')
    }

    return data.user.id
  }

  async getOverview(accessToken: string) {
    const userId = await this.getUserIdFromToken(accessToken)

    const [incomingRequests, outgoingRequests, friends, suggestions] = await Promise.all([
      this.getIncomingRequests(userId),
      this.getOutgoingRequests(userId),
      this.getFriends(userId),
      this.getSuggestedTravelers(userId),
    ])

    return {
      incomingRequests,
      outgoingRequests,
      friends,
      suggestions,
    }
  }

  async searchTravelers(accessToken: string, q?: string) {
    const userId = await this.getUserIdFromToken(accessToken)
    const query = q?.trim()

    let request = this.db
      .from('profiles')
      .select('id, first_name, last_name, email')
      .neq('id', userId)
      .limit(10)

    if (query) {
      const safeQuery = query
        .replace(/[,%()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      const [firstName, ...restNames] = safeQuery.split(' ')
      const lastName = restNames.join(' ')
      const filters = [
        `first_name.ilike.%${safeQuery}%`,
        `last_name.ilike.%${safeQuery}%`,
        `email.ilike.%${safeQuery}%`,
      ]

      if (firstName && lastName) {
        filters.push(
          `and(first_name.ilike.%${firstName}%,last_name.ilike.%${lastName}%)`,
          `and(first_name.ilike.%${lastName}%,last_name.ilike.%${firstName}%)`,
        )
      }

      request = request.or(filters.join(','))
    }

    const { data, error } = await request

    if (error) {
      throw new BadRequestException(error.message)
    }

    const relationships = await this.getRelationshipMap(userId)

    return (data || []).map((profile) => {
      const relation = relationships.get(profile.id)

      return {
        ...profile,
        relationshipStatus: relation?.status ?? 'none',
        friendshipId: relation?.id ?? null,
      }
    })
  }

  async sendFriendRequest(accessToken: string, targetUserId: string) {
    const userId = await this.getUserIdFromToken(accessToken)

    if (userId === targetUserId) {
      throw new BadRequestException('You cannot add yourself as a friend')
    }

    const targetExists = await this.profileExists(targetUserId)

    if (!targetExists) {
      throw new NotFoundException('Target user not found')
    }

    const existing = await this.findExistingRelationship(userId, targetUserId)

    if (existing) {
      if (existing.status === 'accepted') {
        throw new BadRequestException('You are already friends')
      }

      if (existing.status === 'pending') {
        throw new BadRequestException('Friend request already exists')
      }

      const { data, error } = await this.db
        .from('friendships')
        .update({
          requester_id: userId,
          receiver_id: targetUserId,
          status: 'pending',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        throw new BadRequestException(error.message)
      }

      return data
    }

    const { data, error } = await this.db
      .from('friendships')
      .insert({
        requester_id: userId,
        receiver_id: targetUserId,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      throw new BadRequestException(error.message)
    }

    return data
  }

  async acceptFriendRequest(accessToken: string, requestId: string) {
    const userId = await this.getUserIdFromToken(accessToken)

    const { data, error } = await this.db
      .from('friendships')
      .update({
        status: 'accepted',
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .eq('receiver_id', userId)
      .eq('status', 'pending')
      .select()
      .single()

    if (error || !data) {
      throw new NotFoundException('Friend request not found')
    }

    return data
  }

  async rejectFriendRequest(accessToken: string, requestId: string) {
    const userId = await this.getUserIdFromToken(accessToken)

    const { data, error } = await this.db
      .from('friendships')
      .update({
        status: 'rejected',
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .eq('receiver_id', userId)
      .eq('status', 'pending')
      .select()
      .single()

    if (error || !data) {
      throw new NotFoundException('Friend request not found')
    }

    return data
  }

  async cancelFriendRequest(accessToken: string, requestId: string) {
    const userId = await this.getUserIdFromToken(accessToken)

    const { error } = await this.db
      .from('friendships')
      .delete()
      .eq('id', requestId)
      .eq('requester_id', userId)
      .eq('status', 'pending')

    if (error) {
      throw new BadRequestException(error.message)
    }

    return {
      message: 'Friend request cancelled',
    }
  }

  async removeFriend(accessToken: string, friendshipId: string) {
    const userId = await this.getUserIdFromToken(accessToken)

    const { error } = await this.db
      .from('friendships')
      .delete()
      .eq('id', friendshipId)
      .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
      .eq('status', 'accepted')

    if (error) {
      throw new BadRequestException(error.message)
    }

    return {
      message: 'Friend removed',
    }
  }

  private async getIncomingRequests(userId: string) {
    const { data, error } = await this.db
      .from('friendships')
      .select(
        `
        id,
        status,
        created_at,
        requester:requester_id (
          id,
          first_name,
          last_name,
          email
        )
      `,
      )
      .eq('receiver_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      throw new BadRequestException(error.message)
    }

    return data || []
  }

  private async getOutgoingRequests(userId: string) {
    const { data, error } = await this.db
      .from('friendships')
      .select(
        `
        id,
        status,
        created_at,
        receiver:receiver_id (
          id,
          first_name,
          last_name,
          email
        )
      `,
      )
      .eq('requester_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      throw new BadRequestException(error.message)
    }

    return data || []
  }

  private async getFriends(userId: string) {
    const { data, error } = await this.db
      .from('friendships')
      .select(
        `
        id,
        requester_id,
        receiver_id,
        created_at,
        requester:requester_id (
          id,
          first_name,
          last_name,
          email
        ),
        receiver:receiver_id (
          id,
          first_name,
          last_name,
          email
        )
      `,
      )
      .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false })

    if (error) {
      throw new BadRequestException(error.message)
    }

    return (data || []).map((row) => {
      const friend = row.requester_id === userId ? row.receiver : row.requester

      return {
        friendshipId: row.id,
        profile: friend,
      }
    })
  }

  private async getSuggestedTravelers(userId: string) {
    const relationships = await this.getRelationshipMap(userId)
    const excludedIds = [userId, ...relationships.keys()]

    const { data, error } = await this.db
      .from('profiles')
      .select('id, first_name, last_name, email')
      .limit(20)

    if (error) {
      throw new BadRequestException(error.message)
    }

    return (data || [])
      .filter((profile) => !excludedIds.includes(profile.id))
      .slice(0, 5)
      .map((profile) => ({
        ...profile,
        relationshipStatus: 'none',
        friendshipId: null,
      }))
  }

  private async getRelationshipMap(userId: string) {
    const { data, error } = await this.db
      .from('friendships')
      .select('id, requester_id, receiver_id, status')
      .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)

    if (error) {
      throw new BadRequestException(error.message)
    }

    const map = new Map<
      string,
      {
        id: string
        status: string
      }
    >()

    for (const row of data || []) {
      const otherUserId = row.requester_id === userId ? row.receiver_id : row.requester_id

      map.set(otherUserId, {
        id: row.id,
        status: row.status,
      })
    }

    return map
  }

  private async findExistingRelationship(userId: string, targetUserId: string) {
    const { data, error } = await this.db
      .from('friendships')
      .select('id, requester_id, receiver_id, status')
      .or(
        `and(requester_id.eq.${userId},receiver_id.eq.${targetUserId}),and(requester_id.eq.${targetUserId},receiver_id.eq.${userId})`,
      )
      .maybeSingle()

    if (error) {
      throw new BadRequestException(error.message)
    }

    return data
  }

  private async profileExists(userId: string) {
    const { data, error } = await this.db
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      throw new BadRequestException(error.message)
    }

    return !!data
  }
}
