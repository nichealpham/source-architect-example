import { allowSingleStorageUpload } from "sandrasoft";

export const RecordMulter = allowSingleStorageUpload('fileUpload', {
    destination: './tmp/uploads',
});
