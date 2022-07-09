# Web Development II

- Styleguide & Wireframe

## Projekt

- Benutzer
- Trainignspläne
- Übungen

## Todo

- Laravel setup with docker
- Laravel testing
- Gitlab
- Entitäten
    - Benutzer
    - Plan
    - Übung
    - Trainingsgruppen
    - Trainer
        - Vorschlag
        - Bewertung
- Authentifizierung
    - Benutzer
        - Benachrichtigung bei bevorstehenden Training
    - Trainer
        - Dashboard für angemeldete trainierende
        - Benachrichtung bei nicht ausführen


## Wireframe

- Landing Page
- Workoutplan
- Durchführung von Workout
- Taineransicht
- Datenvisualisierung
- Login

## Datenbankmodell

- User
  - id
  - name
  - email
  - password
- Role
  - id
  - name
- Exercise
  - id
  - name
  - type
- Set
  - id
  - user_id
  - exercise_id
  - weight
  - reps
- Workout
  - id
  - user_id
- Plan
  - id
  - user_id
- Group
  - is
  - trainer_id

- Plan erstellen und Plan zurueckgeben
- Workouts fuer bestimmten Plan