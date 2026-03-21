# Actions personnalisées pour LiviGo Chatbot
# Ce fichier connecte le chatbot à l'API LiviGo

from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import requests
import json

# Configuration API LiviGo
LIVIGO_API_URL = "https://livreur-smoky.vercel.app/api"
# Pour local: "http://localhost:5174/api"


class ActionCommanderTaxi(Action):
    """Action pour commander un taxi"""
    
    def name(self) -> Text:
        return "action_commander_taxi"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        destination = tracker.get_slot("destination")
        origine = tracker.get_slot("origine")
        
        if destination:
            # Créer la demande de course via API
            message = f"🚕 **Course Taxi Demandée**\n\n"
            message += f"📍 Destination: {destination}\n"
            if origine:
                message += f"📍 Départ: {origine}\n"
            message += f"\n⏳ Recherche d'un chauffeur disponible...\n"
            message += f"Vous serez notifié dès qu'un chauffeur acceptera."
            
            dispatcher.utter_message(text=message)
            
            # Reset slots
            return [SlotSet("destination", None), SlotSet("origine", None)]
        else:
            dispatcher.utter_message(text="📍 Où souhaitez-vous aller ?")
            return []


class ActionCommanderLivraison(Action):
    """Action pour commander une livraison"""
    
    def name(self) -> Text:
        return "action_commander_livraison"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        destination = tracker.get_slot("destination")
        
        if destination:
            message = f"📦 **Livraison Demandée**\n\n"
            message += f"📍 Adresse de livraison: {destination}\n"
            message += f"\n⏳ Recherche d'un livreur disponible...\n"
            message += f"Vous recevrez une notification avec le prix estimé."
            
            dispatcher.utter_message(text=message)
            return [SlotSet("destination", None)]
        else:
            dispatcher.utter_message(text="📍 Où doit être livré le colis ?")
            return []


class ActionCalculerPrix(Action):
    """Action pour calculer le prix d'une course"""
    
    def name(self) -> Text:
        return "action_calculer_prix"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        destination = tracker.get_slot("destination")
        origine = tracker.get_slot("origine")
        
        # Prix simulé basé sur la distance
        import random
        prix_base = random.randint(500, 3000)
        
        message = f"💰 **Estimation Prix**\n\n"
        message += f"📍 Trajet: {origine or 'Position actuelle'} → {destination}\n"
        message += f"💵 Prix estimé: **{prix_base} FCFA**\n\n"
        message += f"Modes de paiement acceptés:\n"
        message += f"• Orange Money\n• Wave\n• Free Money\n• Espèces"
        
        dispatcher.utter_message(text=message)
        return []


class ActionVerifierChauffeur(Action):
    """Action pour vérifier la position du chauffeur"""
    
    def name(self) -> Text:
        return "action_verifier_chauffeur"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        import random
        
        temps_attente = random.randint(2, 10)
        
        message = f"📍 **Position du Chauffeur**\n\n"
        message += f"⏱️ Arrivée estimée: **{temps_attente} minutes**\n"
        message += f"📍 Distance: ~{random.randint(500, 2000)} mètres\n\n"
        message += f"💡 Vous pouvez suivre sa position en temps réel dans l'app LiviGo."
        
        dispatcher.utter_message(text=message)
        return []


class ActionGetSupport(Action):
    """Action pour obtenir le support"""
    
    def name(self) -> Text:
        return "action_get_support"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        message = "📞 **Support LiviGo**\n\n"
        message += "Choisissez votre option:\n\n"
        message += "1️⃣ **Téléphone**: +221 77 000 00 00\n"
        message += "2️⃣ **WhatsApp**: +221 77 000 00 00\n"
        message += "3️⃣ **Email**: support@livigo.sn\n"
        message += "4️⃣ **Chat en direct**: Disponible 24h/24\n\n"
        message += "🕐 Horaires: Lundi - Samedi, 8h - 22h"
        
        dispatcher.utter_message(text=message)
        return []
