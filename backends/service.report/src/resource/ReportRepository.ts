import { MongoDb } from "sandrasoft";
import { Schema } from "mongoose";

const ReportRepository = MongoDb.connect({
    hostname: "",
    dbname: "",
    username: "",
    password: "",
    modelname: "report",
    schema: new Schema({
        _userId: {
            type: Schema.Types.ObjectId,
            index: true,
        },
        _recordId: {
            type: Schema.Types.ObjectId,
            index: true,
        },
        template: String,
        data: {
            type: Schema.Types.Mixed,
            required: true
        },
        createdAt: Date
    }),
});
export { ReportRepository };