-- 제약조건 해제
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS course_places;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS places;
SET FOREIGN_KEY_CHECKS = 1;

-- Place 테이블: 장소 정보
CREATE TABLE places
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Course 테이블: 코스 정보
CREATE TABLE courses
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- CoursePlace 테이블: 코스 내 장소 정보 및 순서
CREATE TABLE course_places
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    course_id   INT NOT NULL,              -- 코스 ID
    place_id    INT NOT NULL,              -- 장소 ID
    `rank`      VARCHAR(255) DEFAULT NULL, -- Reorank 값 (순서 관리)
    order_index INT          DEFAULT NULL, -- 명시적 순서 (PUT 방식)
#     prev_id     INT NULL,                  -- Linked List 방식
    FOREIGN KEY (course_id) REFERENCES courses (id),
    FOREIGN KEY (place_id) REFERENCES places (id)
#     FOREIGN KEY (prev_id) REFERENCES course_places (id)
);
