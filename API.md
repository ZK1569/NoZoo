# Routes utilisateurs :

## Obtenir les informations de l'utilisateur

- **URL** : `GET {{URL}}/auth/me/`

## Obtenir la liste de tous les rôles

- **URL** : `GET {{URL}}/auth/role`

## Déconnexion

- **URL** : `POST {{URL}}/auth/logout`

## Créer un utilisateur

- **URL** : `POST {{URL}}/auth/subscribe`

Un fichier JSON doit être envoyé avec cette commande.

Exemple de fichier JSON :
```json
{
  "login": "{{new_user_mail}}",
  "password": "{{new_user_password}}"
}
```
## Connexion

- **URL** : `POST {{URL}}/auth/login`

Un fichier JSON doit être envoyé avec cette commande.

Exemple de fichier JSON :
```json
{
  "login": "{{new_user_mail}}",
  "password": "{{new_user_password}}"
}
```

## Assigner un rôle

- **URL** : `POST {{URL}}/auth/role`

Un fichier JSON doit être envoyé avec cette commande.

Exemple de fichier JSON :
```json
{
  "user_id": "{{new_user_id}}",
  "role": "{{role_id_maintenance_agent}}"
}
```

# Routes espaces

## Obtenir la liste des espaces du zoo

- **URL** : `GET {{URL}}/space/`

## Ajouter un espace au zoo

- **URL** : `POST {{URL}}/space/`

Un fichier JSON doit être envoyé avec cette commande.

Exemple de fichier JSON :

```json
{
"name": "Space pour test",
"description": "{{$randomJobDescriptor}}",
"capacity": 5,
"handicapped_access": {{$randomBoolean}}
}
```
                        
            
## Mettre à jour l'état de la maintenance d'un espace

- **URL** : PUT {{URL}}/space/maintenance

Un fichier JSON avec l'ID de l'espace et le nouvel état de maintenance doit être envoyé.

Exemple de fichier JSON :
```json
{
"spaceId": "{{space_id}}",
"state" : false
}
```

## Ouvrir/Fermer un espace

- **URL** : PUT {{URL}}/space/open

Un fichier JSON avec l'ID de l'espace et le nouvel état d'ouverture doit être envoyé.

Exemple de fichier JSON :
```json
{
"spaceId": "{{space_id}}",
"state" : true
}
```

## Définir/Mettre à jour l'indication d'entrée handicapée

- **URL** : PUT {{URL}}/space/accessibility

Un fichier JSON avec l'ID de l'espace et le booléen indiquant la présence d'une entrée facile doit être envoyé.

Exemple de fichier JSON :
```json
{
"spaceId": "{{space_id}}",
"state" : true
}
```

## Ajouter une date de maintenance

- **URL** : POST {{URL}}/space/new/maintenance_task

Le fichier doit être accompagné d'un corps JSON comme l'exemple suivant :

Exemple de fichier JSON :
```json
{
"spaceId": "{{space_id}}",
"action" : "{{$randomCatchPhrase}}"
}
```
# Routes Animals : 

## Obtenir les informations d'un animal

- **URL** : `GET {{URL}}/animal/?id={{animal_id}}`

## Créer un nouvel animal

- **URL** : `POST {{URL}}/animal/`

Un fichier JSON doit être envoyé avec cette commande.

Exemple de fichier JSON :
```json
{
  "name": "{{$randomFullName}}",
  "sex": {{$randomBoolean}},
  "date": "2021-02-15"
}
```

## Ajouter un traitement à un animal

- **URL** : `POST {{URL}}/animal/treatment`

Un fichier JSON doit être envoyé avec cette commande.

Exemple de fichier JSON :
```json
{
  "animalId": "{{animal_id}}",
  "action": "Première visite médicale de Leo",
  "date": "2023-05-12"
}
```

# Routes groupes d'animaux : 

## Obtenir les informations d'un groupe d'animaux

- **URL** : `GET {{URL}}/animal/group/?id={{animal_group_id}}`

## Créer un groupe d'animaux

- **URL** : `POST {{URL}}/animal/group/`

Un fichier JSON doit être envoyé avec cette commande.

Exemple de fichier JSON :
```json
{
  "name": "{{$randomFullName}}",
  "sex": {{$randomBoolean}},
  "date": "2021-02-15"
}
```

## Ajouter des informations d'un animal au groupe

- **URL** : `POST {{URL}}/animal/group/`

Un fichier JSON doit être envoyé avec cette commande.

Exemple de fichier JSON :
```json
{
  "animalId": "{{animal_id}}",
  "animalGroupId": "{{animal_group_id}}"
}
```

## Mettre à jour l'espace d'un groupe d'animaux

- **URL** : `PUT {{URL}}/animal/group/space`

Cette route permet de mettre à jour l'espace assigné à un groupe d'animaux. Cette fonctionnalité retourne une erreur 501.


# Routes du zoo : 

## Obtenir les informations du zoo

- **URL** : `GET {{URL}}/zoo`

## Employé présent dans le zoo

- **URL** : `POST {{URL}}/zoo/employee/in`

Un fichier JSON doit être envoyé avec cette commande.

Exemple de fichier JSON :
```json
{
  "empId": "64609888e55cc9786e78766c"
}
```
## Employé sortant du zoo : 

- **URL** : `POST {{URL}}/zoo/employee/out`
```json
{
    "empId": "64609888e55cc9786e78766c"
}
```
## Ouvrir le zoo : 

- **URL** : `POST {{URL}}/zoo/open`
```json
{
    "status": true
}
```

# Routes des tickets :

## Obtenir les informations d'un ticket

- **URL** : `GET {{URL}}/ticket/?id={{ticket_id}}`

## Créer un ticket

- **URL** : `POST {{URL}}/ticket/`

Un fichier JSON doit être envoyé avec cette commande.

Exemple de fichier JSON :
```json
{
  "type_ticket_id": "649163d65cf646b2ae922f23",
  "list_accessible_spaces": ["6491ac45e85a002620b32c64", "6492c449c082498c9cba1787"]
}
```

## Accéder au zoo avec un ticket : 

- **URL** : `POST {{URL}}/ticket/zoo`
```json
{
    "ticket_id" : "{{ticket_id}}"
}
```
## Accéder à un espace avec un ticket : 

- **URL** : `POST {{URL}}/ticket/space`
```json
{
    "ticket_id" : "{{ticket_id}}",
    "space_id" : "6460e734ea16564f3539eff6"
}
```

## Quitter le zoo avec un ticket : 

- **URL** : `POST {{URL}}/ticket/zoo`
```json
{
    "ticket_id" : "{{ticket_id}}"
}```