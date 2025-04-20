-- Roles
INSERT INTO roles (name) VALUES ('ROLE_USER');
INSERT INTO roles (name) VALUES ('ROLE_MODERATOR');
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');

-- Categories
INSERT INTO categories (name, description, icon_name, created_at, updated_at) 
VALUES ('Football', 'Discuss everything about football, from Premier League to World Cup and beyond.', 'football', NOW(), NOW());

INSERT INTO categories (name, description, icon_name, created_at, updated_at) 
VALUES ('Basketball', 'NBA, college basketball, international leagues, and more.', 'basketball', NOW(), NOW());

INSERT INTO categories (name, description, icon_name, created_at, updated_at) 
VALUES ('Cricket', 'Test matches, ODIs, T20s, IPL, and all cricket discussions.', 'cricket', NOW(), NOW());

INSERT INTO categories (name, description, icon_name, created_at, updated_at) 
VALUES ('Baseball', 'MLB, international baseball, and everything related to America''s pastime.', 'baseball', NOW(), NOW());

INSERT INTO categories (name, description, icon_name, created_at, updated_at) 
VALUES ('Tennis', 'Grand Slams, ATP, WTA, and all tennis discussions.', 'tennis', NOW(), NOW());

INSERT INTO categories (name, description, icon_name, created_at, updated_at) 
VALUES ('Golf', 'PGA Tour, Masters, Open Championship, and all golf topics.', 'golf', NOW(), NOW());

INSERT INTO categories (name, description, icon_name, created_at, updated_at) 
VALUES ('Cycling', 'Tour de France, road cycling, mountain biking, and more.', 'bike', NOW(), NOW());

INSERT INTO categories (name, description, icon_name, created_at, updated_at) 
VALUES ('Fitness', 'Training tips, fitness routines, nutrition advice for athletes.', 'dumbbell', NOW(), NOW());

-- Badges
INSERT INTO badges (name, description, icon) 
VALUES ('Early Adopter', 'Joined during the first month of FanNation launch', '🏆');

INSERT INTO badges (name, description, icon) 
VALUES ('Top Contributor', 'One of the most active members in the community', '🥇');

INSERT INTO badges (name, description, icon) 
VALUES ('Thread Master', 'Created over 100 popular discussion threads', '📝');

INSERT INTO badges (name, description, icon) 
VALUES ('Poll Expert', 'Created over 50 community polls', '📊');

INSERT INTO badges (name, description, icon) 
VALUES ('Helpful Commenter', 'Posts that consistently receive positive feedback', '💬');

INSERT INTO badges (name, description, icon) 
VALUES ('1 Year Member', 'Been part of the community for one year', '🎂');
