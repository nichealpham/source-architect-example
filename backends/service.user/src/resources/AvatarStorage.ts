import * as path from 'path';
import { GoogleStorage } from 'sandrasoft';

const UserAvatarStorage = new GoogleStorage({
    serviceAccountPath: path.join(__dirname, '/../../', 'private/service-account.json'),
    directory: 'avatar',
});

export { UserAvatarStorage };
