import { defineStore } from 'pinia';

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
};

export type IncomingRequest = {
  id: string;
  status: string;
  created_at: string;
  requester: Profile;
};

export type OutgoingRequest = {
  id: string;
  status: string;
  created_at: string;
  receiver: Profile;
};

export type Friend = {
  friendshipId: string;
  profile: Profile;
};

export type Traveler = Profile & {
  relationshipStatus?: 'none' | 'pending' | 'accepted' | 'rejected' | 'cancelled';
  friendshipId?: string | null;
};

export type FriendTab = 'myTrip' | 'friends' | 'publicTrips';

export const useFriendStore = defineStore('friend', {
  state: () => ({
    incomingRequests: [] as IncomingRequest[],
    outgoingRequests: [] as OutgoingRequest[],
    friends: [] as Friend[],
    suggestions: [] as Traveler[],
    searchResults: [] as Traveler[],

    activeTab: 'friends' as FriendTab,
    searchQuery: '',
    currentUserId: '',

    loading: false,
    searching: false,
    actionLoadingId: '',
    error: '',
  }),

  getters: {
    travelersToShow: (state) => {
      if (state.searchQuery.trim()) {
        return state.searchResults;
      }

      return state.suggestions;
    },
  },

  actions: {
    setTab(tab: FriendTab) {
      this.activeTab = tab;
    },

    isActionLoading(id: string) {
      return this.actionLoadingId === id;
    },

    getStoredUserId() {
      try {
        const user = JSON.parse(localStorage.getItem('user') || 'null') as {
          id?: string;
        } | null;

        return user?.id || '';
      } catch {
        return '';
      }
    },

    resetFriendState() {
      this.incomingRequests = [];
      this.outgoingRequests = [];
      this.friends = [];
      this.suggestions = [];
      this.searchResults = [];
      this.searchQuery = '';
      this.error = '';
      this.loading = false;
      this.searching = false;
      this.actionLoadingId = '';
    },

    syncCurrentUser() {
      const storedUserId = this.getStoredUserId();

      if (this.currentUserId !== storedUserId) {
        this.currentUserId = storedUserId;
        this.resetFriendState();
      }
    },

    getAccessToken() {
      return localStorage.getItem('access_token') || localStorage.getItem('accessToken') || '';
    },

    authHeaders() {
      const accessToken = this.getAccessToken();

      return {
        Authorization: `Bearer ${accessToken}`,
      };
    },

    ensureLoggedIn() {
      const accessToken = this.getAccessToken();

      if (!accessToken) {
        this.error = 'Please login first';
        return false;
      }

      return true;
    },

    async fetchOverview() {
      this.syncCurrentUser();

      if (!this.ensureLoggedIn()) return;

      this.loading = true;
      this.error = '';

      try {
        const response = await fetch('/api/friends/overview', {
          headers: this.authHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          this.error = data.message || 'Failed to load friends overview';
          return;
        }

        this.incomingRequests = data.incomingRequests || [];
        this.outgoingRequests = data.outgoingRequests || [];
        this.friends = data.friends || [];
        this.suggestions = data.suggestions || [];
      } catch {
        this.error = 'Cannot connect to friend API';
      } finally {
        this.loading = false;
      }
    },

    async searchTravelers(q: string) {
      this.searchQuery = q;
      this.error = '';

      if (!this.ensureLoggedIn()) return;

      if (!q.trim()) {
        this.searchResults = [];
        return;
      }

      this.searching = true;

      try {
        const response = await fetch(
          `/api/friends/travelers/search?q=${encodeURIComponent(q)}`,
          {
            headers: this.authHeaders(),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          this.error = data.message || 'Failed to search travelers';
          return;
        }

        this.searchResults = data || [];
      } catch {
        this.error = 'Cannot search travelers';
      } finally {
        this.searching = false;
      }
    },

    updateTravelerStatus(
      travelerId: string,
      relationshipStatus: Traveler['relationshipStatus'],
      friendshipId: string | null = null,
    ) {
      const update = (traveler: Traveler) => (
        traveler.id === travelerId
          ? { ...traveler, relationshipStatus, friendshipId }
          : traveler
      );

      this.suggestions = this.suggestions.map(update);
      this.searchResults = this.searchResults.map(update);
    },

    async sendFriendRequest(targetUserId: string) {
      if (!this.ensureLoggedIn()) return;

      const loadingId = `send:${targetUserId}`;
      this.actionLoadingId = loadingId;
      this.error = '';

      const previousSuggestions = [...this.suggestions];
      const previousSearchResults = [...this.searchResults];
      const previousOutgoingRequests = [...this.outgoingRequests];
      const targetProfile = this.travelersToShow.find(
        (traveler) => traveler.id === targetUserId,
      );

      this.updateTravelerStatus(targetUserId, 'pending');

      try {
        const response = await fetch(`/api/friends/requests/${targetUserId}`, {
          method: 'POST',
          headers: this.authHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          this.error = data.message || 'Failed to send friend request';
          this.suggestions = previousSuggestions;
          this.searchResults = previousSearchResults;
          this.outgoingRequests = previousOutgoingRequests;
          return;
        }

        this.updateTravelerStatus(targetUserId, 'pending', data.id);

        if (targetProfile && !this.outgoingRequests.some((request) => request.id === data.id)) {
          this.outgoingRequests = [
            {
              id: data.id,
              status: data.status || 'pending',
              created_at: data.created_at || new Date().toISOString(),
              receiver: targetProfile,
            },
            ...this.outgoingRequests,
          ];
        }
      } catch {
        this.error = 'Cannot send friend request';
        this.suggestions = previousSuggestions;
        this.searchResults = previousSearchResults;
        this.outgoingRequests = previousOutgoingRequests;
      } finally {
        if (this.actionLoadingId === loadingId) {
          this.actionLoadingId = '';
        }
      }
    },

    async acceptRequest(requestId: string) {
      if (!this.ensureLoggedIn()) return;

      const loadingId = `accept:${requestId}`;
      this.actionLoadingId = loadingId;
      this.error = '';

      const previousIncomingRequests = [...this.incomingRequests];
      const previousFriends = [...this.friends];
      const previousSuggestions = [...this.suggestions];
      const previousSearchResults = [...this.searchResults];
      const acceptedRequest = this.incomingRequests.find(
        (request) => request.id === requestId,
      );

      this.incomingRequests = this.incomingRequests.filter(
        (request) => request.id !== requestId,
      );

      if (acceptedRequest && !this.friends.some((friend) => friend.friendshipId === requestId)) {
        this.friends = [
          {
            friendshipId: requestId,
            profile: acceptedRequest.requester,
          },
          ...this.friends,
        ];

        this.updateTravelerStatus(acceptedRequest.requester.id, 'accepted', requestId);
      }

      try {
        const response = await fetch(`/api/friends/requests/${requestId}/accept`, {
          method: 'PATCH',
          headers: this.authHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          this.error = data.message || 'Failed to accept friend request';
          this.incomingRequests = previousIncomingRequests;
          this.friends = previousFriends;
          this.suggestions = previousSuggestions;
          this.searchResults = previousSearchResults;
          return;
        }
      } catch {
        this.error = 'Cannot accept request';
        this.incomingRequests = previousIncomingRequests;
        this.friends = previousFriends;
        this.suggestions = previousSuggestions;
        this.searchResults = previousSearchResults;
      } finally {
        if (this.actionLoadingId === loadingId) {
          this.actionLoadingId = '';
        }
      }
    },

    async rejectRequest(requestId: string) {
      if (!this.ensureLoggedIn()) return;

      const loadingId = `reject:${requestId}`;
      this.actionLoadingId = loadingId;
      this.error = '';

      const previousIncomingRequests = [...this.incomingRequests];
      const previousSuggestions = [...this.suggestions];
      const previousSearchResults = [...this.searchResults];
      const rejectedRequest = this.incomingRequests.find(
        (request) => request.id === requestId,
      );

      this.incomingRequests = this.incomingRequests.filter(
        (request) => request.id !== requestId,
      );

      if (rejectedRequest) {
        this.updateTravelerStatus(rejectedRequest.requester.id, 'none');
      }

      try {
        const response = await fetch(`/api/friends/requests/${requestId}/reject`, {
          method: 'PATCH',
          headers: this.authHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          this.error = data.message || 'Failed to reject friend request';
          this.incomingRequests = previousIncomingRequests;
          this.suggestions = previousSuggestions;
          this.searchResults = previousSearchResults;
          return;
        }
      } catch {
        this.error = 'Cannot reject request';
        this.incomingRequests = previousIncomingRequests;
        this.suggestions = previousSuggestions;
        this.searchResults = previousSearchResults;
      } finally {
        if (this.actionLoadingId === loadingId) {
          this.actionLoadingId = '';
        }
      }
    },

    async cancelRequest(requestId: string) {
      if (!this.ensureLoggedIn()) return;

      const loadingId = `cancel:${requestId}`;
      this.actionLoadingId = loadingId;
      this.error = '';

      const previousOutgoingRequests = [...this.outgoingRequests];
      const previousSuggestions = [...this.suggestions];
      const previousSearchResults = [...this.searchResults];
      const cancelledRequest = this.outgoingRequests.find(
        (request) => request.id === requestId,
      );

      this.outgoingRequests = this.outgoingRequests.filter(
        (request) => request.id !== requestId,
      );

      if (cancelledRequest) {
        this.updateTravelerStatus(cancelledRequest.receiver.id, 'none');
      }

      try {
        const response = await fetch(`/api/friends/requests/${requestId}/cancel`, {
          method: 'DELETE',
          headers: this.authHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          this.error = data.message || 'Failed to cancel friend request';
          this.outgoingRequests = previousOutgoingRequests;
          this.suggestions = previousSuggestions;
          this.searchResults = previousSearchResults;
          return;
        }
      } catch {
        this.error = 'Cannot cancel request';
        this.outgoingRequests = previousOutgoingRequests;
        this.suggestions = previousSuggestions;
        this.searchResults = previousSearchResults;
      } finally {
        if (this.actionLoadingId === loadingId) {
          this.actionLoadingId = '';
        }
      }
    },

    async removeFriend(friendshipId: string) {
      if (!this.ensureLoggedIn()) return;

      const loadingId = `remove:${friendshipId}`;
      this.actionLoadingId = loadingId;
      this.error = '';

      const previousFriends = [...this.friends];
      const previousSuggestions = [...this.suggestions];
      const previousSearchResults = [...this.searchResults];
      const removedFriend = this.friends.find(
        (friend) => friend.friendshipId === friendshipId,
      );

      this.friends = this.friends.filter(
        (friend) => friend.friendshipId !== friendshipId,
      );

      if (removedFriend) {
        this.updateTravelerStatus(removedFriend.profile.id, 'none');
      }

      try {
        const response = await fetch(`/api/friends/${friendshipId}`, {
          method: 'DELETE',
          headers: this.authHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          this.error = data.message || 'Failed to remove friend';
          this.friends = previousFriends;
          this.suggestions = previousSuggestions;
          this.searchResults = previousSearchResults;
          return;
        }
      } catch {
        this.error = 'Cannot remove friend';
        this.friends = previousFriends;
        this.suggestions = previousSuggestions;
        this.searchResults = previousSearchResults;
      } finally {
        if (this.actionLoadingId === loadingId) {
          this.actionLoadingId = '';
        }
      }
    },
  },
});
