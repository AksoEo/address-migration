const path = require('path');
const fs = require('fs');

export class DataFile {
    constructor(filePath, _clone = null) {
        if (_clone) {
            Object.assign(this, _clone);
        } else {
            this.filePath = filePath;
            this.fileData = fs.readFileSync(filePath, 'utf-8');
            this.entries = this.fileData.split('\n').map(entry => {
                if (!entry) return null;
                return JSON.parse(entry);
            }).filter(x => x);
            this.entriesById = {};
            for (const entry of this.entries) this.entriesById[entry.id] = entry;

            this.resultFilePath = filePath + '_res';
            this.resultEntries = {};
            try {
                const data = fs.readFileSync(this.resultFilePath, 'utf-8');
                data.split('\n').map(entry => JSON.parse(entry)).forEach(entry => {
                    this.resultEntries[entry.id] = entry;
                });
            } catch (err) {
                console.error('Could not read results', err);
            }
        }
    }

    clone() {
        return new DataFile(this.filePath, this);
    }

    findNextBlank() {
        for (const item of this.entries) {
            if (this.resultEntries[item.id]) continue;
            return item.id;
        }
        return null;
    }

    setSkipped(id) {
        this.resultEntries[id] = { id, skipped: true };
        this.saveResults();
    }

    setResult(id, addr) {
        this.resultEntries[id] = {
            id,
            country: this.entriesById[id].country,
            addr,
        };
        this.saveResults();
    }

    saveResults() {
        const entriesStr = Object.values(this.resultEntries)
            .map(entry => JSON.stringify(entry))
            .join('\n');
        fs.writeFileSync(this.resultFilePath, entriesStr);
    }
}
