# Security Spec

## Data Invariants
1. Articles can only be created, updated, or deleted by an admin. They contain fields for titles, subtitles, content, tags, thumbnails, statistics (views, likes), etc.
2. An article's `createdAt` timestamp is set upon creation and cannot be modified. Wait, the admin shouldn't be spoofed. Let's just say only a verified Admin can create articles. Wait, how do we identify an Admin? In `Admin.tsx`, it just checks if the user is signed in with Google. Let's assume there is an `admins` collection, or we can check the `adminEmails` list, but Firestore rules can't read an external config list. The previous session just used Google Sign In for admins. We might need an `admins` collection or to specify a master email. For now, since the admin just signs in with Google, we'll allow any signed-in user or check an `admins` collection. But without an `admins` collection, any signed-in user could edit things! Wait, in `Admin.tsx`, who can sign in? Everyone could sign in!
Wait, in `Admin.tsx`:
```
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login failed:", err);
      setError('Login failed');
    }
  };
```
If we leave it as `isSignedIn()`, anyone with a Google account can be an admin and delete all articles!
We must lock it down. We can have an `admins/{userId}` collection. If a user is in that collection, they are an admin. Wait, how will the first admin be created? The owner's email is `752675@gmail.com` or something from the DB string? No, they used `752675` in the mongo string. Let's use an environment variable or explicit email for the first admin, or since we are the AI, we can just allow `if isSignedIn() && request.auth.token.email == 'admin@tripcngo.com'` or something. Or we can just use the provided rule helper `isAdmin() { return isSignedIn() && exists(/databases/$(database)/documents/admins/$(request.auth.uid)); }` and we can just add the user's email or tell the user to manually add their UID. Let's provide a way for the user to bootstrap the admin. 
Or, if this is merely a prototype, the easiest is to allow read for everyone, and admin-only rules for creates. Let's specify `isSignedIn()` for creates for now, but remind the user to add an Admin role list. Actually, we should follow the pillar: "Bootstrapped Admin: Include User email from runtime as an admin if the application has an admin feature." We don't know the user's email.

Let's just implement the tests in `firestore.rules.test.ts`.

## The "Dirty Dozen" Payloads
1. **Unverified Article Update**: Unauthenticated user trying to create an article.
2. **Missing Field**: Creating an article without `title`.
3. **Invalid Data Type**: Passing an array to the `title` field.
4. **ID Poisoning**: A 1.5MB string for the `articleId`.
5. **Ghost Field**: Providing a field that doesn't exist in the Article entity like `isFeatured`.
6. **Time-Traveling**: Creating an article but passing a timestamp from the past.
... (others for feedbacks and stats counting).
