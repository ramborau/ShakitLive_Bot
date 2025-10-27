interface UserProfile {
  first_name: string;
  last_name: string;
  profile_pic: string;
  id: string;
}

export class MessengerPeopleService {
  private static readonly API_URL = process.env.MESSENGERPEOPLE_API_URL!;
  private static readonly CHANNEL_UUID =
    process.env.MESSENGERPEOPLE_CHANNEL_UUID!;
  private static readonly BEARER_TOKEN =
    process.env.MESSENGERPEOPLE_BEARER_TOKEN!;

  /**
   * Fetch user profile from MessengerPeople API
   */
  static async getUserProfile(recipientId: string): Promise<UserProfile | null> {
    try {
      const url = `${this.API_URL}/${this.CHANNEL_UUID}/${recipientId}`;

      console.log(
        `[MessengerPeople] Fetching user profile for ${recipientId}...`
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/vnd.messengerpeople.v1+json",
          Accept: "application/vnd.messengerpeople.v1+json",
          Authorization: `Bearer ${this.BEARER_TOKEN}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `[MessengerPeople] Failed to fetch user profile: ${response.status} ${response.statusText}`
        );
        console.error(`[MessengerPeople] Error response:`, errorText);
        return null;
      }

      const data: UserProfile = await response.json();

      console.log(
        `[MessengerPeople] User profile fetched: ${data.first_name} ${data.last_name}`
      );

      return data;
    } catch (error) {
      console.error(`[MessengerPeople] Error fetching user profile:`, error);
      return null;
    }
  }

  /**
   * Enrich user data with profile information
   */
  static async enrichUser(recipientId: string): Promise<{
    firstName: string;
    lastName: string;
    profilePic: string;
  }> {
    const profile = await this.getUserProfile(recipientId);

    if (!profile) {
      // Return generic data if enrichment fails
      return {
        firstName: "User",
        lastName: recipientId.substring(0, 8),
        profilePic: "",
      };
    }

    return {
      firstName: profile.first_name,
      lastName: profile.last_name,
      profilePic: profile.profile_pic,
    };
  }
}
