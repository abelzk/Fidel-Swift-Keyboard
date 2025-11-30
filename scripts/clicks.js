class ClickTracker {
  constructor() {
    this.supabaseUrl = window.__SUPABASE_URL__
    this.supabaseAnonKey = window.__SUPABASE_ANON_KEY__
    this.tableName = "downloadS"
    this.trackerId = "btnDownload"

    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      console.error(
        "Supabase credentials not found. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
      )
    }
  }
  async getClickCount() {
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
      console.error("rror fetching click count:", error)
      return 0
    }
  }

  // Increment click count and save to Supabase
  async trackClick() {
    try {
      const currentCount = await this.getClickCount()
      const newCount = currentCount + 1

      // Try to update existing record, if it doesn't exist, insert new one
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

      // If no rows were updated, insert a new record
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
          // Insert new record
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

window.clickTracker = new ClickTracker()
