import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
} from "react-native-appwrite";
  
export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.aora',
    projectId: '66b1d6ba002576194b59',
    databaseId: '66b1d8ad000c771d1fd6',
    userCollectionId: '66b1d8d4002fc07dd832',
    videoCollectionId: '66b1d8f10036dabfc6c2',
    storageId: '66b1e1f300287747cbc9'
};
  
const client = new Client();
  
client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);
  
const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
  
// Register user
export async function createUser(email, password, username) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );
  
        if (!newAccount) throw Error;
  
        const avatarUrl = avatars.getInitials(username);
  
        await signIn(email, password);
  
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
            accountId: newAccount.$id,
            email: email,
            username: username,
            avatar: avatarUrl,
            }
        );
  
        return newUser;
    } catch (error) {
        throw new Error(error);
    }
}
  
// Sign In
export async function signIn(email, password) {
    try {
        const session = await account.createEmailSession(email, password);
    
        return session;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}
  
// Get Account
export async function getAccount() {
    try {
        const currentAccount = await account.get();
        return currentAccount;
    } catch (error) {
        throw new Error(error);
    }
}
  
// Get Current User
export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();
        if (!currentAccount) throw Error;
    
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );
    
        if (!currentUser) throw Error;
    
        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Get all posts
export async function getAllPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId
        );
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

// Get latest created video posts
export async function getLatestPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(7)]
        );
    
        return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
}

export async function searchPosts(query) {
    try {
        const posts = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.videoCollectionId,
          [Query.search("title", query)]
        );
    
        if (!posts) throw new Error("Something went wrong");
    
        return posts.documents;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

export async function getUserPosts(userId) {
    try {
        const posts = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.videoCollectionId,
          [Query.equal("creators", userId)]
        );
    
        if (!posts) throw new Error("Something went wrong");
    
        return posts.documents;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

export async function signOut(params) {
    try {
        const session = await account.deleteSession("current");
    
        return session;
    } catch (error) {
        throw new Error(error);
    }
}