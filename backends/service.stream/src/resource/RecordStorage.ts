import * as path from 'path';
import { GoogleStorage } from 'sandrasoft';

export const RecordStorage = new GoogleStorage({
    serviceAccountPath: path.join(__dirname, '/../../', 'private/service-account.json'),
    directory: 'record',
});
