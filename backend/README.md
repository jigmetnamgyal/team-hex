## Initial Setup

---
### Prerequisites

The setups steps expect following tools installed on the system.

- Git
- Ruby 3.0.3
- Rails 6.1.4.6
- PostgreSQL

##### 1. Install the needed gem

```bash
cd backend/
bundle install
```

##### 2. Create and setup the database

```bash
bundle exec rake db:create
bundle exec rake db:migrate
bundle exec rake db:seed
```

##### 3. Start server and try your services!

```bash
rails s
```
---

#### 3. To edit or view the application secrets (You need access to master key and it can be found in our notion):

```bash
EDITOR="vim" rails credentials:edit
rails credentials:show
```
