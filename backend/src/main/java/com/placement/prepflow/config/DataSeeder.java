package com.placement.prepflow.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.placement.prepflow.entity.*;
import com.placement.prepflow.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final RoleRepository roleRepository;
    private final SimulationRoundRepository simulationRoundRepository;
    private final QuestionRepository questionRepository;
    private final ObjectMapper objectMapper;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (companyRepository.count() > 0) {
                return; // already seeded
            }

            // 1. User
            User user = User.builder().name("Shreyash Nathe").email("shreyash@example.com").build();
            userRepository.save(user);

            // 2. Companies
            Company tcs = Company.builder().name("TCS").logoUrl("tcs-logo.png").build();
            Company amazon = Company.builder().name("Amazon").logoUrl("amazon-logo.png").build();
            companyRepository.saveAll(List.of(tcs, amazon));

            // 3. Roles
            Role tcsNinja = Role.builder().name("Ninja Developer").company(tcs).build();
            Role amazonSDE = Role.builder().name("SDE-1").company(amazon).build();
            roleRepository.saveAll(List.of(tcsNinja, amazonSDE));

            // 4. TCS Ninja Simulation Rounds
            SimulationRound tcsAptitude = SimulationRound.builder().roundType(RoundType.APTITUDE).sequenceOrder(1).description("Numerical & Logical Reasoning").role(tcsNinja).build();
            SimulationRound tcsCoding = SimulationRound.builder().roundType(RoundType.CODING).sequenceOrder(2).description("Basic Problem Solving").role(tcsNinja).build();
            SimulationRound tcsHR = SimulationRound.builder().roundType(RoundType.HR_INTERVIEW).sequenceOrder(3).description("Behavioral Questions").role(tcsNinja).build();
            simulationRoundRepository.saveAll(List.of(tcsAptitude, tcsCoding, tcsHR));

            // 5. Amazon SDE Simulation Rounds
            SimulationRound amzAptitude = SimulationRound.builder().roundType(RoundType.APTITUDE).sequenceOrder(1).description("Quantitative Aptitude & Verbal").role(amazonSDE).build();
            SimulationRound amzCoding = SimulationRound.builder().roundType(RoundType.CODING).sequenceOrder(2).description("DSA and Problem Solving (Hard)").role(amazonSDE).build();
            SimulationRound amzTech = SimulationRound.builder().roundType(RoundType.TECHNICAL_INTERVIEW).sequenceOrder(3).description("System Design & Core CS").role(amazonSDE).build();
            SimulationRound amzHR = SimulationRound.builder().roundType(RoundType.HR_INTERVIEW).sequenceOrder(4).description("Amazon Leadership Principles").role(amazonSDE).build();
            simulationRoundRepository.saveAll(List.of(amzAptitude, amzCoding, amzTech, amzHR));

            // 6. Insert Mock Questions for Amazon SDE -> Coding
            String optionsEmpty = "[]";
            Question amzQ1 = Question.builder().questionText("Given an array of integers, return indices of the two numbers such that they add up to a specific target.").options(optionsEmpty).expectedAnswer("[0, 1]").difficulty("Easy").simulationRound(amzCoding).build();
            Question amzQ2 = Question.builder().questionText("Given the root of a binary tree, return its maximum depth.").options(optionsEmpty).expectedAnswer("3").difficulty("Medium").simulationRound(amzCoding).build();
            questionRepository.saveAll(List.of(amzQ1, amzQ2));

            // Insert Mock Questions for TCS Ninja -> Aptitude
            String optsApt = "[\"10 days\", \"12 days\", \"15 days\", \"20 days\"]";
            Question tcsQ1 = Question.builder().questionText("If 5 men can complete a work in 10 days, in how many days can 10 men complete the same work?").options(optsApt).expectedAnswer("5 days").difficulty("Easy").simulationRound(tcsAptitude).build();
            String optsApt2 = "[\"25\", \"50\", \"75\", \"100\"]";
            Question tcsQ2 = Question.builder().questionText("What is 10% of 250?").options(optsApt2).expectedAnswer("25").difficulty("Easy").simulationRound(tcsAptitude).build();
            questionRepository.saveAll(List.of(tcsQ1, tcsQ2));
            
            // Insert Mock Question for Amazon HR
            Question hrQ1 = Question.builder().questionText("Behavioral: Tell me about a time you had to dive deep to solve a complex problem without enough initial data.").options(optionsEmpty).expectedAnswer("STAR").difficulty("Medium").simulationRound(amzHR).build();
            Question hrQ2 = Question.builder().questionText("Behavioral: Describe a situation where you disagreed with a team member. How did you handle it?").options(optionsEmpty).expectedAnswer("STAR").difficulty("Medium").simulationRound(amzHR).build();
            questionRepository.saveAll(List.of(hrQ1, hrQ2));
        };
    }
}
