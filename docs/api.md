# Documentation des APIs MNP Tracker

## Table des matières

1. [Authentification](#authentification)
2. [Utilisateurs](#utilisateurs)
3. [Investissements](#investissements)
4. [Bétail](#betail)
5. [Tâches](#taches)
6. [Timeline](#timeline)
7. [Rapports](#rapports)
8. [Notifications](#notifications)

## Base URL

```
http://localhost:3000/api
```

## Authentification

### Login

```http
POST /auth/login
```

**Corps de la requête**
```json
{
  "email": "string",
  "password": "string"
}
```

**Réponse**
```json
{
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "role": "string",
    "permissions": "string[]"
  },
  "token": "string"
}
```

### Valider le token

```http
GET /auth/validate
```

**Headers**
```
Authorization: Bearer <token>
```

## Utilisateurs

### Liste des utilisateurs

```http
GET /users
```

**Headers**
```
Authorization: Bearer <token>
```

### Créer un utilisateur

```http
POST /users
```

**Corps de la requête**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "admin | user | readonly",
  "permissions": "string[]"
}
```

### Mettre à jour un utilisateur

```http
PUT /users/:id
```

### Supprimer un utilisateur

```http
DELETE /users/:id
```

## Investissements

### Liste des investissements

```http
GET /investments
```

**Paramètres de requête**
```
category: string
status: string
startDate: string (YYYY-MM-DD)
endDate: string (YYYY-MM-DD)
```

### Créer un investissement

```http
POST /investments
```

**Corps de la requête**
```json
{
  "category": "string",
  "typeOfInvestment": "string",
  "initialAmount": "number",
  "currentValue": "number",
  "dateOfInvestment": "string (YYYY-MM-DD)",
  "locationId": "number",
  "status": "string"
}
```

### Statistiques des investissements

```http
GET /investments/stats
```

### Performance d'un investissement

```http
GET /investments/:id/performance
```

## Bétail

### Liste du bétail

```http
GET /livestock
```

**Paramètres de requête**
```
type: string
status: string
investmentId: number
```

### Créer un animal

```http
POST /livestock
```

**Corps de la requête**
```json
{
  "uniqueIdentifier": "string",
  "type": "string",
  "race": "string",
  "dateOfBirth": "string (YYYY-MM-DD)",
  "gender": "male | female",
  "acquisitionDate": "string (YYYY-MM-DD)",
  "acquisitionPrice": "number",
  "currentStatus": "healthy | sick | sold | deceased",
  "investmentId": "number"
}
```

### Historique de santé

```http
GET /livestock/:id/health-history
```

## Tâches

### Liste des tâches

```http
GET /tasks
```

**Paramètres de requête**
```
status: string
priority: string
assignedTo: number
startDate: string (YYYY-MM-DD)
endDate: string (YYYY-MM-DD)
```

### Créer une tâche

```http
POST /tasks
```

**Corps de la requête**
```json
{
  "title": "string",
  "description": "string",
  "startDate": "string (YYYY-MM-DD)",
  "endDate": "string (YYYY-MM-DD)",
  "status": "pending | in_progress | completed | cancelled",
  "priority": "low | medium | high",
  "assignedTo": "number",
  "investmentId": "number"
}
```

## Timeline

### Liste des événements

```http
GET /timeline
```

**Paramètres de requête**
```
type: string
category: string
visibilityLevel: string
startDate: string (YYYY-MM-DD)
endDate: string (YYYY-MM-DD)
```

### Créer un événement

```http
POST /timeline
```

**Corps de la requête**
```json
{
  "title": "string",
  "description": "string",
  "eventDate": "string (YYYY-MM-DD)",
  "type": "investment | livestock | task | financial | general",
  "category": "creation | update | completion | milestone | alert | other",
  "investmentId": "number?",
  "livestockId": "number?",
  "locationId": "number?",
  "mediaUrls": "string[]?",
  "visibilityLevel": "public | private | team"
}
```

## Rapports

### Rapport financier

```http
GET /reports/financial
```

**Paramètres de requête**
```
startDate: string (YYYY-MM-DD)
endDate: string (YYYY-MM-DD)
```

### Rapport du bétail

```http
GET /reports/livestock
```

### Rapport des tâches

```http
GET /reports/tasks
```

### Rapport complet

```http
GET /reports/complete
```

## Notifications

### Liste des notifications

```http
GET /notifications
```

**Paramètres de requête**
```
type: string
isRead: boolean
limit: number
```

### Marquer comme lu

```http
PATCH /notifications/:id/read
```

### Marquer tout comme lu

```http
POST /notifications/mark-all-read
```

### Supprimer une notification

```http
DELETE /notifications/:id
```

## Codes d'erreur

- 400: Requête invalide
- 401: Non authentifié
- 403: Non autorisé
- 404: Ressource non trouvée
- 500: Erreur serveur

## Notes d'utilisation

1. Toutes les requêtes (sauf /auth/login) nécessitent un token JWT dans le header Authorization
2. Les dates doivent être au format YYYY-MM-DD
3. Les montants sont en MGA (Ariary)
4. Les permissions sont vérifiées selon le rôle de l'utilisateur