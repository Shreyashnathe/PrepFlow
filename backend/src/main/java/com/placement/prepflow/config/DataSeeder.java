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
            if (companyRepository.count() > 0) {
                return; // already seeded
            }

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

            // 4. Amazon SDE Simulation Rounds
            SimulationRound amzAptitude = SimulationRound.builder().roundType(RoundType.APTITUDE).sequenceOrder(1).description("Quantitative Aptitude & Logical Reasoning").role(amzSDE).build();
            SimulationRound amzCoding = SimulationRound.builder().roundType(RoundType.CODING).sequenceOrder(2).description("Data Structures & Algorithms").role(amzSDE).build();
            SimulationRound amzHR = SimulationRound.builder().roundType(RoundType.HR_INTERVIEW).sequenceOrder(3).description("Amazon Leadership Principles (Behavioral)").role(amzSDE).build();
            simulationRoundRepository.saveAll(List.of(amzAptitude, amzCoding, amzHR));

            // 5. TCS Ninja Simulation Rounds
            SimulationRound tcsApt = SimulationRound.builder().roundType(RoundType.APTITUDE).sequenceOrder(1).description("Numerical Reasoning").role(tcsNinja).build();
            SimulationRound tcsCode = SimulationRound.builder().roundType(RoundType.CODING).sequenceOrder(2).description("Basic Logical Problem Solving").role(tcsNinja).build();
            simulationRoundRepository.saveAll(List.of(tcsApt, tcsCode));

            // ------------------ MOCK QUESTIONS ------------------ //

            // --- Amazon SDE Aptitude ---
            String opts1 = "[\"12\", \"15\", \"18\", \"24\"]";
            Question amzQ1 = Question.builder().questionText("If the sum of a number and its square is 182, what is the number?").options(opts1).expectedAnswer("13").difficulty("Medium").simulationRound(amzAptitude).build(); // Trick question, closest positive is 13 (13+169=182) wait actually 13 or -14. I'll adjust options.
            opts1 = "[\"12\", \"13\", \"14\", \"15\"]";
            amzQ1.setOptions(opts1);

            String opts2 = "[\"10 days\", \"12 days\", \"14 days\", \"16 days\"]";
            Question amzQ2 = Question.builder().questionText("A and B can together finish a work in 30 days. They worked together for 20 days and then B left. After another 20 days, A finished the remaining work. In how many days A alone can finish the work?").options(opts2).expectedAnswer("60 days").difficulty("Hard").simulationRound(amzAptitude).build();
            opts2 = "[\"40 days\", \"50 days\", \"60 days\", \"70 days\"]";
            amzQ2.setOptions(opts2);
            questionRepository.saveAll(List.of(amzQ1, amzQ2));

            // --- Amazon SDE Coding (Advanced JSON Mapping) ---
            ObjectNode coding1 = objectMapper.createObjectNode();
            coding1.put("title", "1. Two Sum Optimization");
            coding1.put("description", "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You must write an algorithm with **O(n)** runtime complexity.");
            coding1.put("constraints", "- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9\n- -10^9 <= target <= 10^9");
            ArrayNode tcs1 = coding1.putArray("testcases");
            tcs1.add("Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].");
            tcs1.add("Input: nums = [3,2,4], target = 6\nOutput: [1,2]");
            
            Question amzCod1 = Question.builder()
                .questionText(coding1.toString()) // JSON String
                .options("[]").expectedAnswer("Optimized HashMap").difficulty("Medium").simulationRound(amzCoding).build();

            ObjectNode coding2 = objectMapper.createObjectNode();
            coding2.put("title", "2. Trapping Rain Water");
            coding2.put("description", "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.");
            coding2.put("constraints", "- n == height.length\n- 1 <= n <= 2 * 10^4\n- 0 <= height[i] <= 10^5");
            ArrayNode tcs2 = coding2.putArray("testcases");
            tcs2.add("Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6\nExplanation: The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.");
            
            Question amzCod2 = Question.builder()
                .questionText(coding2.toString())
                .options("[]").expectedAnswer("Two Pointer approach").difficulty("Hard").simulationRound(amzCoding).build();
            
            questionRepository.saveAll(List.of(amzCod1, amzCod2));

            // --- Amazon HR Behavioral ---
            Question hrAmz1 = Question.builder()
                .questionText("Customer Obsession: Describe a time when you went significantly out of your way to help a customer/user, beyond what was expected in your role.")
                .options("[]").expectedAnswer("STAR").difficulty("Medium").simulationRound(amzHR).build();
            Question hrAmz2 = Question.builder()
                .questionText("Dive Deep: Tell me about a time you had to analyze a complex problem to find a root cause that the rest of the team completely missed.")
                .options("[]").expectedAnswer("STAR").difficulty("Medium").simulationRound(amzHR).build();
            questionRepository.saveAll(List.of(hrAmz1, hrAmz2));
            
            // --- TCS Ninja Coding ---
            ObjectNode tcsCoding1 = objectMapper.createObjectNode();
            tcsCoding1.put("title", "Reverse String keeping structural grammar");
            tcsCoding1.put("description", "Write a program to reverse a given string. Ensure that the complexity is minimized and you handle null checks.");
            tcsCoding1.put("constraints", "- 1 <= s.length <= 10^5\n- String consists of printable ASCII characters.");
            ArrayNode tcsTc1 = tcsCoding1.putArray("testcases");
            tcsTc1.add("Input: s = \"hello\"\nOutput: \"olleh\"");
            
            Question tcsCod1 = Question.builder()
                .questionText(tcsCoding1.toString())
                .options("[]").expectedAnswer("StringBuilder reverse").difficulty("Easy").simulationRound(tcsCode).build();
            
            // --- TCS Ninja Aptitude (Missing Data Restored) ---
            String tcsOpt1 = "[\"5 days\", \"10 days\", \"15 days\", \"20 days\"]";
            Question tcsAptQ1 = Question.builder()
                .questionText("If 5 men can complete a work in 10 days, in how many days can 10 men complete the same work?")
                .options(tcsOpt1).expectedAnswer("5 days").difficulty("Easy").simulationRound(tcsApt).build();
                
            String tcsOpt2 = "[\"25\", \"50\", \"75\", \"100\"]";
            Question tcsAptQ2 = Question.builder()
                .questionText("What is 10% of 250?")
                .options(tcsOpt2).expectedAnswer("25").difficulty("Easy").simulationRound(tcsApt).build();
                
            questionRepository.saveAll(List.of(tcsCod1, tcsAptQ1, tcsAptQ2));
        };
    }
}
