export default class StreamService {
    constructor(axios) {
        this.axios = axios;
    }

    getWaveforms(_recordId, start, limit) {
        return this.axios.get(`/waveform/get/${_recordId}?start=${start}&limit=${limit}`);
    }
};
