erDiagram
    USERS {
        bigint id PK
        varchar username
        varchar email
        varchar password
        text bio
        varchar profile_picture
        int points
        timestamp created_at
        timestamp updated_at
    }
    
    ROLES {
        bigint id PK
        varchar name
    }
    
    CATEGORIES {
        bigint id PK
        varchar name
        text description
        varchar icon_name
        timestamp created_at
        timestamp updated_at
    }
    
    THREADS {
        bigint id PK
        varchar title
        text content
        bigint user_id FK
        bigint category_id FK
        int view_count
        timestamp created_at
        timestamp updated_at
    }
    
    COMMENTS {
        bigint id PK
        text content
        bigint user_id FK
        bigint thread_id FK
        bigint parent_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    POLLS {
        bigint id PK
        varchar question
        bigint user_id FK
        bigint category_id FK
        timestamp expires_at
        timestamp created_at
        timestamp updated_at
    }
    
    POLL_OPTIONS {
        bigint id PK
        bigint poll_id FK
        varchar text
    }
    
    BADGES {
        bigint id PK
        varchar name
        text description
        varchar icon
    }
    
    NOTIFICATIONS {
        bigint id PK
        bigint user_id FK
        text message
        varchar type
        varchar link
        boolean is_read
        timestamp created_at
    }
    
    USER_ROLES {
        bigint user_id FK
        bigint role_id FK
    }
    
    USER_FOLLOWED_CATEGORIES {
        bigint user_id FK
        bigint category_id FK
    }
    
    USER_FOLLOWERS {
        bigint follower_id FK
        bigint followed_id FK
        timestamp created_at
    }
    
    THREAD_LIKES {
        bigint thread_id FK
        bigint user_id FK
        timestamp created_at
    }
    
    COMMENT_LIKES {
        bigint comment_id FK
        bigint user_id FK
        timestamp created_at
    }
    
    POLL_VOTES {
        bigint option_id FK
        bigint user_id FK
        timestamp created_at
    }
    
    USER_BADGES {
        bigint user_id FK
        bigint badge_id FK
        timestamp awarded_at
    }
    
    USERS ||--o{ THREADS : creates
    USERS ||--o{ COMMENTS : writes
    USERS ||--o{ POLLS : creates
    CATEGORIES ||--o{ THREADS : contains
    CATEGORIES ||--o{ POLLS : contains
    THREADS ||--o{ COMMENTS : has
    COMMENTS ||--o{ COMMENTS : replies_to
    POLLS ||--o{ POLL_OPTIONS : has
    
    USERS }|--|| USER_ROLES : has
    ROLES }|--|| USER_ROLES : assigned_to
    
    USERS }|--|| USER_FOLLOWED_CATEGORIES : follows
    CATEGORIES }|--|| USER_FOLLOWED_CATEGORIES : followed_by
    
    USERS }|--|| USER_FOLLOWERS : follows
    USERS }|--|| USER_FOLLOWERS : followed_by
    
    USERS }|--|| THREAD_LIKES : likes
    THREADS }|--|| THREAD_LIKES : liked_by
    
    USERS }|--|| COMMENT_LIKES : likes
    COMMENTS }|--|| COMMENT_LIKES : liked_by
    
    USERS }|--|| POLL_VOTES : votes
    POLL_OPTIONS }|--|| POLL_VOTES : voted_by
    
    USERS }|--|| USER_BADGES : earns
    BADGES }|--|| USER_BADGES : earned_by
    
    USERS ||--o{ NOTIFICATIONS : receives
