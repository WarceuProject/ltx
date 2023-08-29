/**
 * BaileysEvent map
 * connection = 1
 * creds = 2
 * messaging-history = 3
 * chats = 4
 * presence = 5
 * contacts = 6
 * messages = 7
 * message-receipt = 8
 * groups = 9
 * group-participants = 10
 * blocklist = 11
 * call = 12
 * SubBaileysEvent
 * update = 0
 * set = 1
 * upsert = 2
 * delete = 3
 * media-update = 4
 * reaction = 5
 * v2 sub
 * v2 = 0
 */
export enum BaileysEvent {
	'connection.update' = 10,
	'creds.update' = 20,
	'messaging-history.set' = 31,
	'chats.upsert' = 42,
	'chats.update' = 40,
	'chats.delete' = 43,
	'presence.update' = 50,
	'contacts.upsert' = 62,
	'contacts.update' = 60,
	'messages.delete' = 73,
	'messages.update' = 70,
	'messages.media-update' = 74,
	'messages.upsert' = 72,
	'messages.upsert-v2' = 720,
	'messages.reaction' = 75,
	'message-receipt.update' = 80,
	'groups.upsert' = 92,
	'groups.update' = 90,
	'group-participants.update' = 100,
	'group-participants.update-v2' = 1000,
	'blocklist.set' = 111,
	'blocklist.update' = 110,
	'call' = 12
}
