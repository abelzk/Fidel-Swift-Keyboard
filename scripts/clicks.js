class ClickTracker {
  constructor() {
    this.supabaseUrl = window.NEXT_PUBLIC_SUPABASE_URL
    this.supabaseAnonKey = window.NEXT_PUBLIC_SUPABASE_ANON_KEY
    this.tableName = "click_counts"
    this.trackerId = "btnDownload"

    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      console.error("[ClickTracker] Supabase credentials are missing. Check your environment variables.")
    }
  }

  async getClickCount() {
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      console.error("[ClickTracker] Supabase credentials not available in getClickCount()")
      return 0
    }

    try {
      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/${this.tableName}?id=eq.${this.trackerId}&select=count`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            apikey: this.supabaseAnonKey,
            Authorization: `Bearer ${this.supabaseAnonKey}`,
          },
        },
      )

      if (!response.ok) {
        console.error(`[ClickTracker] Failed to fetch click count. HTTP status: ${response.status}`)
        return 0
      }

      const data = await response.json()
      return data.length > 0 ? data[0].count : 0
    } catch (error) {
      console.error("[ClickTracker] Error fetching click count:", error)
      return 0
    }
  }

  async trackClick() {
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      console.error("[ClickTracker] Supabase credentials not available in trackClick()")
      return
    }

    try {
      const currentCount = await this.getClickCount()
      const newCount = currentCount + 1

      // Try to update existing record
      const upsertResponse = await fetch(`${this.supabaseUrl}/rest/v1/${this.tableName}?id=eq.${this.trackerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: this.supabaseAnonKey,
          Authorization: `Bearer ${this.supabaseAnonKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ count: newCount }),
      })

      if (!upsertResponse.ok) {
        console.error(`[ClickTracker] Failed to update record. HTTP status: ${upsertResponse.status}`)
        return currentCount
      }

      // Verify record exists
      const checkResponse = await fetch(`${this.supabaseUrl}/rest/v1/${this.tableName}?id=eq.${this.trackerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          apikey: this.supabaseAnonKey,
          Authorization: `Bearer ${this.supabaseAnonKey}`,
        },
      })

      if (!checkResponse.ok) {
        console.error(`[ClickTracker] Failed to verify record after update. HTTP status: ${checkResponse.status}`)
        return currentCount
      }

      const checkData = await checkResponse.json()

      if (checkData.length === 0) {
        // Insert new record if it doesn't exist
        const insertResponse = await fetch(`${this.supabaseUrl}/rest/v1/${this.tableName}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: this.supabaseAnonKey,
            Authorization: `Bearer ${this.supabaseAnonKey}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ id: this.trackerId, count: 1 }),
        })

        if (!insertResponse.ok) {
          console.error(`[ClickTracker] Insert failed. HTTP status: ${insertResponse.status}`)
          return currentCount
        }

        return 1
      }

      return newCount
    } catch (error) {
      console.error("[ClickTracker] Error tracking click:", error)
      return
    }
  }
}

// Initialize and expose to window
window.clickTracker = new ClickTracker()
