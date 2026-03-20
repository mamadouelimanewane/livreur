import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

// Crée le client Supabase pour l'authentification et l'accès aux données
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Fonctions utilitaires pour faciliter l'interaction avec le backend
 */
export const db = {
  // Gestion des profils de conducteurs
  drivers: {
    async getAll() {
      const { data, error } = await supabase.from('drivers').select('*')
      if (error) throw error
      return data
    },
    async updateStatus(id, active) {
      const { data, error } = await supabase
        .from('drivers')
        .update({ is_online: active })
        .eq('id', id)
      if (error) throw error
      return data
    }
  },
  
  // Gestion des commandes / courses (rides)
  rides: {
    async create(rideData) {
      const { data, error } = await supabase.from('rides').insert(rideData)
      if (error) throw error
      return data
    },
    async getByUser(userId) {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', userId)
      if (error) throw error
      return data
    }
  }
}
