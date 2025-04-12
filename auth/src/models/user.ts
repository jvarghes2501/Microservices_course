import mongoose from "mongoose";
import { Password } from "../services/password";
// interface to descripbe the properties that are required to create a user document
interface UserAttrs {
  email: string;
  password: string;
}

// interface that descibes the properties that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// interface that describes the properties that a user document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
export { User };

/*
The UserDoc represents the type that is returned when using 
the model to create a single document or instance (e.g. when calling User.build).
UserModel represents the type of the entire collection, 
or Model, that is returned when calling mongoose.model('User', userSchema).
Here, we passed UserModel because we modified the Mongoose 
library's model when we added the "build" function. 
Otherwise, it would not have been needed. For example, 
I used the solution that was suggested in the previous video's comments.
With that solution we didn't need to use the build function, so there was no need to modify the Mongoose Model, and thus no need to create and pass in UserModel.

*/
