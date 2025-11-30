class ClickTracker {
  constructor() {
    this.supabaseUrl = window.NEXT_PUBLIC_SUPABASE_URL
    this.supabaseAnonKey = window.NEXT_PUBLIC_SUPABASE_ANON_KEY
    this.tableName = "click_counts"
    this.trackerId = "btnDownload"
  }

  async getClickCount() {
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      console.error("Supabase credentials not available")
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
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.length > 0 ? data[0].count : 0
    } catch (error) {
      console.error("Error fetching click count:", error)
      return 0
    }
  }

  async trackClick() {
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      throw new Error("Supabase credentials not available")
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

      if (upsertResponse.status === 204 || upsertResponse.status === 200) {
        const checkResponse = await fetch(`${this.supabaseUrl}/rest/v1/${this.tableName}?id=eq.${this.trackerId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            apikey: this.supabaseAnonKey,
            Authorization: `Bearer ${this.supabaseAnonKey}`,
          },
        })

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
            throw new Error(`Insert failed with status: ${insertResponse.status}`)
          }

          return 1
        }
      }

      return newCount
    } catch (error) {
      console.error("Error tracking click:", error)
      throw error
    }
  }
}

// Initialize and expose to window
window.clickTracker = new ClickTracker()
