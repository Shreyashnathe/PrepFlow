package com.placement.prepflow.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.placement.prepflow.entity.*;
import com.placement.prepflow.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final RoleRepository roleRepository;
    private final SimulationRoundRepository simulationRoundRepository;
    private final QuestionRepository questionRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            boolean initialSeedDone = companyRepository.count() > 0;
            if (!initialSeedDone) {

            // 1. User
            User user = User.builder()
                .name("Test Candidate")
                .email("test@example.com")
                .password(passwordEncoder.encode("password"))
                .build();
            userRepository.save(user);

            // 2. Companies
            Company amz = Company.builder().name("Amazon").logoUrl("amazon-logo.png").build();
            Company tcs = Company.builder().name("TCS").logoUrl("tcs-logo.png").build();
            companyRepository.saveAll(List.of(amz, tcs));

            // 3. Roles
            Role amzSDE = Role.builder().name("Software Development Engineer I").company(amz).build();
            Role tcsNinja = Role.builder().name("TCS Ninja Developer").company(tcs).build();
            roleRepository.saveAll(List.of(amzSDE, tcsNinja));

            // 4. Amazon SDE Simulation Rounds (Apt -> Coding -> Tech -> HR)
            SimulationRound amzAptitude = SimulationRound.builder().roundType(RoundType.APTITUDE).sequenceOrder(1).description("Quantitative & Logical").role(amzSDE).build();
            SimulationRound amzCoding = SimulationRound.builder().roundType(RoundType.CODING).sequenceOrder(2).description("DSA").role(amzSDE).build();
            SimulationRound amzTech = SimulationRound.builder().roundType(RoundType.TECHNICAL_INTERVIEW).sequenceOrder(3).description("System Design & OS").role(amzSDE).build();
            SimulationRound amzHR = SimulationRound.builder().roundType(RoundType.HR_INTERVIEW).sequenceOrder(4).description("Leadership Principles").role(amzSDE).build();
            simulationRoundRepository.saveAll(List.of(amzAptitude, amzCoding, amzTech, amzHR));

            // 5. TCS Ninja Simulation Rounds (Apt -> Coding -> Tech)
            SimulationRound tcsApt = SimulationRound.builder().roundType(RoundType.APTITUDE).sequenceOrder(1).description("Numerical").role(tcsNinja).build();
            SimulationRound tcsCode = SimulationRound.builder().roundType(RoundType.CODING).sequenceOrder(2).description("Problem Solving").role(tcsNinja).build();
            SimulationRound tcsTech = SimulationRound.builder().roundType(RoundType.TECHNICAL_INTERVIEW).sequenceOrder(3).description("Core CS Fundamentals").role(tcsNinja).build();
            simulationRoundRepository.saveAll(List.of(tcsApt, tcsCode, tcsTech));

            // ------------------ MOCK QUESTIONS ------------------ //

            // --- Amazon SDE Aptitude ---
            String opts1 = "[\"12\", \"13\", \"14\", \"15\"]";
            Question amzQ1 = Question.builder().questionText("If the sum of a number and its square is 182, what is the positive number?").options(opts1).expectedAnswer("13").difficulty("Medium").simulationRound(amzAptitude).build();

            String opts2 = "[\"40 days\", \"50 days\", \"60 days\", \"70 days\"]";
            Question amzQ2 = Question.builder().questionText("A and B can together finish a work in 30 days. They worked together for 20 days and then B left. After another 20 days, A finished the remaining work. In how many days A alone can finish the work?").options(opts2).expectedAnswer("60 days").difficulty("Hard").simulationRound(amzAptitude).build();
            questionRepository.saveAll(List.of(amzQ1, amzQ2));

            // --- Amazon SDE Coding ---
            ObjectNode coding1 = objectMapper.createObjectNode();
            coding1.put("title", "1. Two Sum Optimization");
            coding1.put("description", "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.");
            coding1.put("constraints", "- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9");
            ArrayNode tcs1 = coding1.putArray("testcases");
            tcs1.add("Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]");
            Question amzCod1 = Question.builder().questionText(coding1.toString()).options("[]").expectedAnswer("Optimized HashMap").difficulty("Medium").simulationRound(amzCoding).build();
            questionRepository.saveAll(List.of(amzCod1));

            // --- Amazon SDE TECHNICAL INTERVIEW ---
            String amzTechOpts1 = "[\"Vertical Scaling\", \"Horizontal Scaling (Sharding)\", \"Add more RAM\", \"Index everything\"]";
            Question amzTechQ1 = Question.builder().questionText("In System Design, you are scaling a User Database that receives 10,000 writes per second. Which strategy avoids single-point-of-failure and bottlenecks?").options(amzTechOpts1).expectedAnswer("Horizontal Scaling (Sharding)").difficulty("Hard").simulationRound(amzTech).build();
            
            String amzTechOpts2 = "[\"CAP Theorem\", \"ACID Properties\", \"RESTful Guidelines\", \"SOLID Principles\"]";
            Question amzTechQ2 = Question.builder().questionText("Which theoretical concept states that a distributed data store can only simultaneously provide two out of three guarantees: Consistency, Availability, and Partition Tolerance?").options(amzTechOpts2).expectedAnswer("CAP Theorem").difficulty("Medium").simulationRound(amzTech).build();
            questionRepository.saveAll(List.of(amzTechQ1, amzTechQ2));

            // --- Amazon HR Behavioral ---
            Question hrAmz1 = Question.builder().questionText("Describe a time when you went significantly out of your way to help a customer, beyond your role.").options("[]").expectedAnswer("STAR").difficulty("Medium").simulationRound(amzHR).build();
            questionRepository.saveAll(List.of(hrAmz1));
            
            // --- TCS Ninja Aptitude  ---
            String tcsOpt1 = "[\"5 days\", \"10 days\", \"15 days\", \"20 days\"]";
            Question tcsAptQ1 = Question.builder().questionText("If 5 men can complete a work in 10 days, in how many days can 10 men complete the same work?").options(tcsOpt1).expectedAnswer("5 days").difficulty("Easy").simulationRound(tcsApt).build();
            questionRepository.saveAll(List.of(tcsAptQ1));

            // --- TCS Ninja Coding ---
            ObjectNode tcsCoding1 = objectMapper.createObjectNode();
            tcsCoding1.put("title", "Reverse String keeping structural grammar");
            tcsCoding1.put("description", "Write a program to reverse a given string.");
            tcsCoding1.put("constraints", "- 1 <= s.length <= 10^5");
            ArrayNode tcsTc1 = tcsCoding1.putArray("testcases");
            tcsTc1.add("Input: s = \"hello\"\nOutput: \"olleh\"");
            Question tcsCod1 = Question.builder().questionText(tcsCoding1.toString()).options("[]").expectedAnswer("StringBuilder reverse").difficulty("Easy").simulationRound(tcsCode).build();
            questionRepository.saveAll(List.of(tcsCod1));

            // --- TCS Ninja TECHNICAL INTERVIEW ---
            String tcsTechOpts1 = "[\"Java\", \"C++\", \"Python\", \"HTML\"]";
            Question tcsTechQ1 = Question.builder().questionText("Which of the following is NOT an Object-Oriented Programming language exactly?").options(tcsTechOpts1).expectedAnswer("HTML").difficulty("Easy").simulationRound(tcsTech).build();
            String tcsTechOpts2 = "[\"SELECT\", \"INSERT\", \"UPDATE\", \"ROLLBACK\"]";
            Question tcsTechQ2 = Question.builder().questionText("Which of the following SQL commands is part of DML (Data Manipulation Language)?").options(tcsTechOpts2).expectedAnswer("INSERT").difficulty("Easy").simulationRound(tcsTech).build();
            questionRepository.saveAll(List.of(tcsTechQ1, tcsTechQ2));
            }

            java.util.List<String> companyNames = java.util.Arrays.asList(
                "BMC Softwares", "Siemens", "Tiaa India", "Tracelink", "Deutsche Bank", 
                "UBS", "PhonePe", "BNY Mellon", "Druva", "Mastercard", "UptiQ", 
                "Avaya", "Altometa", "Schlumberger", "Bajaj Finserv", "Barclays", 
                "Ion", "Toshiba", "Adobe", "Ideas", "Searce", "eQ Technologies", 
                "JPMC", "Dragonfly Financial Technologies", "Energy Exemplar", 
                "Metro-GSC", "ISS", "E2Open", "ACA Group", "Merilytics", 
                "General Mills", "Wissen Technology", "Flextrade", "Altizon", 
                "Tech Verito", "Intangles Lab", "HSBC", "Northern Trust", 
                "Emerson", "ZS Associates", "Rockwell Automation", "Ayaan Autonomous", 
                "Amdocs", "TCS R&D", "Qualys"
            );

            for (String name : companyNames) {
                if (companyRepository.findByName(name).isEmpty()) {
                    Company company = Company.builder().name(name).build();
                    company = companyRepository.save(company);
                    Role defaultRole = Role.builder().name("Software Development Engineer").company(company).build();
                    roleRepository.save(defaultRole);
                }
            }
        };
    }
}
