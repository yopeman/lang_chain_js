import { readFile, writeFile } from 'fs/promises';

class ConversationMemory {
    constructor(thread_id) {
        this.thread_id = thread_id;
        this.memory_filepath = './conversation_memory.json';
    }

    async save({ role, content }) {
        try {
            let data = {};
            try {
                const fileData = await readFile(this.memory_filepath, 'utf8');
                data = JSON.parse(fileData);
            } catch (err) {
                if (err.code === 'ENOENT' || err instanceof SyntaxError) {
                    data = {};
                } else {
                    throw err;
                }
            }

            if (!data[this.thread_id]) {
                data[this.thread_id] = [];
            }

            data[this.thread_id].push({ role, content });

            await writeFile(this.memory_filepath, JSON.stringify(data, null, 2), 'utf8');
            console.log(`Conversation saved for thread: ${this.thread_id}`);
        } catch (err) {
            console.error(`Error saving conversation: ${err}`);
        }
    }

    async get() {
        try {
            const fileData = await readFile(this.memory_filepath, 'utf8');
            const data = JSON.parse(fileData);
            return data[this.thread_id] || [];
        } catch (err) {
            if (err.code === 'ENOENT') {
                return [];
            } else if (err instanceof SyntaxError) {
                console.error('Error parsing JSON, returning empty history.');
                return [];
            }
            console.error(`Error retrieving conversation: ${err}`);
        }
    }

    async history() {
        let data = await this.get() || []
        let data_list = data.map(e => (`${e.role}: ${e.content}`))
        return data_list.join('\n\n')
    }
}

export default ConversationMemory