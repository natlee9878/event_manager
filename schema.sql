DROP DATABASE if exists event_management;
CREATE DATABASE event_management;
USE event_management;

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `first_name` varchar(25) NOT NULL,
  `last_name` varchar(25) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address` varchar(100) NOT NULL,
  `password` varchar(64) NOT NULL,
  `is_admin` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `first_name`, `last_name`, `email`, `phone`, `address`, `password`, `is_admin`) VALUES
(10, 'Duc ', 'Hoang', 'hoangminhduc19102002@gmail.com', '04497841033', '3AA Ellis', '$Duc191002', b'0'),
(15, 'Nat', 'Lee', 'natlee1111@gmail.com', '0421221', 'Adelaide Uni', '1234567890', b'0'),
(19, 'Duc', 'Hoang', 'snkraus2020@gmail.com', '+61449784103', '3 Ellis Street, 3 Ellis Street, Magill, Adelaide', '19102002', b'0');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;
CREATE TABLE `event` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `location` varchar(100) NOT NULL,
  `host_email` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `event`
--

INSERT INTO `event` (`id`, `name`, `start_time`, `end_time`, `location`, `host_email`) VALUES
(12, 'Birthday', '2022-06-03 18:46:00', '2022-06-03 19:46:00', '3 Ellis St', 'hoangminhduc19102002@gmail.com'),
(19, 'New Year', '2022-06-04 15:18:00', '2022-06-04 16:18:00', '29A dwui', 'hoangminhduc19102002@gmail.com'),
(22, 'New Year', '2022-06-04 13:30:00', '2022-06-04 14:30:00', 'University of Adelaide', 'hoangminhduc19102002@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `event`
--
ALTER TABLE `event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

CREATE TABLE `user_event` (
  `event_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_event`
--

INSERT INTO `user_event` (`event_id`, `email`) VALUES
(12, 'hoangminhduc19102002@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user_event`
--
ALTER TABLE `user_event`
  ADD PRIMARY KEY (`event_id`,`email`);
COMMIT;
