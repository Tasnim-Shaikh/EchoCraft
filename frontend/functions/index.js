const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// This is your existing function for creating users
exports.createNewUser = functions.https.onCall(async (data, context) => {
  // ... your existing code for this function
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be an authenticated admin to create a user.",
    );
  }
  // ... rest of the function code
  const { email, password, username } = data;
  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: username,
    });
    await admin.database().ref(`/users/${userRecord.uid}`).set({
      email: email,
      username: username,
      registrationDate: new Date().toLocaleDateString("en-US"),
    });
    return { result: `Successfully created user ${email}` };
  } catch (error) {
    console.error("Error creating new user:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// --- ADD THIS NEW FUNCTION ---
// This function securely updates a user's password
exports.updateUserPassword = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be an authenticated admin to update a password.",
    );
  }

  const { uid, newPassword } = data;

  if (!uid || !newPassword) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "User ID and new password are required.",
    );
  }

  try {
    await admin.auth().updateUser(uid, {
      password: newPassword,
    });
    return { result: "Password updated successfully." };
  } catch (error) {
    console.error("Error updating password:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});