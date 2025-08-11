import { Model } from '@nozbe/watermelondb';
import { field, json } from '@nozbe/watermelondb/decorators';

export default class Message extends Model {
  static table = 'messages';

  @field('room_id') roomId!: string;
  @field('from') from!: string;
  @field('is_received') isReceived!: boolean;
  @field('type') type!: string;
  @json('content', (raw) => raw) content!: any;
  @field('created_at') createdAt!: number;
  @field('edited_at') editedAt?: number;
  @field('status') status?: string;
  @field('ref_message_id') refMessageId?: string;
  @field('ref_type') refType?: string;
  @json('ref_content', (raw) => raw) refContent?: any;
}
