drop Database FanNation;
CREATE DATABASE FanNation;
USE FanNation;


-- User Table (modified to include session_token)
CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    session_token VARCHAR(255)  -- Added for session management
);

-- Admin Table (inherits from User)
CREATE TABLE Admin (
    id INT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES User(id) ON DELETE CASCADE
);

-- Category Table
CREATE TABLE Category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- Thread Table
CREATE TABLE Thread (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_by INT NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Category(id) ON DELETE CASCADE
);

-- Comment Table
CREATE TABLE Comment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    created_by INT NOT NULL,
    thread_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (thread_id) REFERENCES Thread(id) ON DELETE CASCADE
);

-- Like Table
CREATE TABLE Likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    comment_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, comment_id),
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES Comment(id) ON DELETE CASCADE
);

-- Poll Table
CREATE TABLE Poll (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES User(id) ON DELETE CASCADE
);

-- Poll Options Table
CREATE TABLE PollOption (
    id INT AUTO_INCREMENT PRIMARY KEY,
    poll_id INT NOT NULL,
    option_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES Poll(id) ON DELETE CASCADE
);

-- Poll Votes Table
CREATE TABLE PollVote (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    poll_option_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, poll_option_id),
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (poll_option_id) REFERENCES PollOption(id) ON DELETE CASCADE
);

-- Notification Table
CREATE TABLE Notification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_id) REFERENCES User(id) ON DELETE CASCADE
);


select * from User;
INSERT INTO User (username, email, password) 
VALUES ('AliceSmith', 'alice.smith@example.com', 'Password@123');

INSERT INTO User (username, email, password) 
VALUES ('BobJones', 'bob.jones@example.com', 'SecurePass456');

INSERT INTO User (username, email, password) 
VALUES ('CharlieBrown', 'charlie.brown@example.com', 'Charlie@789');


-- Authentication Logs (Optional)
CREATE TABLE AuthenticationLog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Success', 'Failed') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
);
select * from user;
INSERT INTO Category (name, description) VALUES
('Football', 'Discussions about football matches, players, and leagues'),
('Basketball', 'All things basketball: NBA, EuroLeague, and more'),
('Soccer', 'Global soccer discussions, including World Cup and Champions League'),
('Tennis', 'Tennis tournaments, players, and fan debates');

-- UserCategoryFollow Table (to track follows)
CREATE TABLE UserCategoryFollow (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category_id), -- Ensure a user can follow a category only once
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Category(id) ON DELETE CASCADE
);
