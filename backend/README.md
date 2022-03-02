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
```

##### 3. Start server and try your services!

```bash
rails s
```
---
