export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = any;

export type Tables<TableName extends string> = Record<string, Json | undefined>;

export type TablesInsert<TableName extends string> = Record<string, Json | undefined>;

export type TablesUpdate<TableName extends string> = Record<string, Json | undefined>;

export type Enums<EnumName extends string> = string;

export type CompositeTypes<CompositeTypeName extends string> = Record<string, Json | undefined>;
