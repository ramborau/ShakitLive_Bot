/**
 * Facebook Profile Service
 *
 * Fetches user profile information from Facebook Graph API.
 * Replaces MessengerPeopleService with official Facebook API.
 *
 * API Documentation: https://developers.facebook.com/docs/messenger-platform/identity/user-profile
 */

interface FacebookUserProfile {
  first_name: string;
  last_name: string;
  profile_pic: string;
  id: string;
}

export class FacebookProfileService {
  private static readonly GRAPH_API_URL = "https://graph.facebook.com/v24.0";
  private static readonly ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN!;

  /**
   * Fetch user profile from Facebook Graph API
   *
   * @param psid - Page-scoped ID of the user
   * @returns User profile or null if fetch fails
   */
  static async getUserProfile(psid: string): Promise<FacebookUserProfile | null> {
    try {
      const url = `${this.GRAPH_API_URL}/${psid}?fields=first_name,last_name,profile_pic&access_token=${this.ACCESS_TOKEN}`;

      console.log(`[FacebookProfile] Fetching user profile for PSID ${psid}...`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `[FacebookProfile] Failed to fetch user profile: ${response.status} ${response.statusText}`
        );
        console.error(`[FacebookProfile] Error response:`, errorText);
        return null;
      }

      const data: FacebookUserProfile = await response.json();

      console.log(
        `[FacebookProfile] User profile fetched: ${data.first_name} ${data.last_name} (${psid})`
      );

      return data;
    } catch (error) {
      console.error(`[FacebookProfile] Error fetching user profile:`, error);
      return null;
    }
  }

  /**
   * Enrich user data with profile information from Facebook
   *
   * @param psid - Page-scoped ID of the user
   * @returns Enriched user data with firstName, lastName, profilePic
   */
  static async enrichUser(psid: string): Promise<{
    firstName: string;
    lastName: string;
    profilePic: string;
  }> {
    const profile = await this.getUserProfile(psid);

    if (!profile) {
      // Return generic data if enrichment fails
      console.warn(`[FacebookProfile] Enrichment failed for ${psid}, using fallback data`);
      return {
        firstName: "User",
        lastName: psid.substring(0, 8),
        profilePic: "",
      };
    }

    return {
      firstName: profile.first_name,
      lastName: profile.last_name,
      profilePic: profile.profile_pic,
    };
  }

  /**
   * Refresh user profile data (call on every message to keep data fresh)
   *
   * @param psid - Page-scoped ID of the user
   * @returns Updated user profile or null if fetch fails
   */
  static async refreshUserProfile(psid: string): Promise<FacebookUserProfile | null> {
    console.log(`[FacebookProfile] Refreshing profile for ${psid}...`);
    return this.getUserProfile(psid);
  }
}
