import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const messageTable = tableSchema({
  name: 'messages',
  columns: [
    { name: 'room_id', type: 'string' },
    { name: 'from', type: 'string' },
    { name: 'is_received', type: 'boolean' },
    { name: 'type', type: 'string' },
    { name: 'content', type: 'string' },
    { name: 'created_at', type: 'number' },
    { name: 'edited_at', type: 'number', isOptional: true },
    { name: 'status', type: 'string', isOptional: true },
    { name: 'ref_message_id', type: 'string', isOptional: true },
    { name: 'ref_type', type: 'string', isOptional: true },
    { name: 'ref_content', type: 'string', isOptional: true },
  ],
});

export const schema = appSchema({
  version: 1,
  tables: [messageTable],
});
