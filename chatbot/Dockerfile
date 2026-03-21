# Dockerfile pour le Chatbot LiviGo (Rasa)

FROM rasa/rasa:latest

WORKDIR /app

# Copier les fichiers de configuration
COPY config.yml .
COPY domain.yml .
COPY credentials.yml .
COPY endpoints.yml .

# Copier les données d'entraînement
COPY data/ ./data/

# Copier les actions personnalisées
COPY actions/ ./actions/

# Exposer les ports
EXPOSE 5005 5055

# Commande par défaut
CMD ["run", "--enable-api", "--cors", "*"]
