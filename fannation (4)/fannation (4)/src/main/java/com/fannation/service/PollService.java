package com.fannation.service;

import com.fannation.dto.PollDto;
import com.fannation.dto.PollOptionDto;
import com.fannation.model.Category;
import com.fannation.model.Poll;
import com.fannation.model.PollOption;
import com.fannation.model.User;
import com.fannation.repository.CategoryRepository;
import com.fannation.repository.PollRepository;
import com.fannation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PollService {
    @Autowired
    private PollRepository pollRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private UserRepository userRepository;

    public Page<PollDto> getAllPolls(Pageable pageable) {
        return pollRepository.findAll(pageable)
                .map(this::mapPollToDto);
    }

    public PollDto getPollById(Long id) {
        Poll poll = pollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Poll not found"));
        return mapPollToDto(poll);
    }

    public Page<PollDto> getPollsByCategory(Long categoryId, Pageable pageable) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
                
        return pollRepository.findByCategoryOrderByCreatedAtDesc(category, pageable)
                .map(this::mapPollToDto);
    }

    public Page<PollDto> getPollsByUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        return pollRepository.findByUserOrderByCreatedAtDesc(user, pageable)
                .map(this::mapPollToDto);
    }

    public List<PollDto> getActivePolls() {
        return pollRepository.findByExpiresAtGreaterThanOrderByCreatedAtDesc(LocalDateTime.now())
                .stream()
                .map(this::mapPollToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public PollDto createPoll(PollDto pollDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        Category category = categoryRepository.findById(pollDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
                
        Poll poll = new Poll();
        poll.setQuestion(pollDto.getQuestion());
        poll.setUser(user);
        poll.setCategory(category);
        
        if (pollDto.getExpiresAt() != null) {
            poll.setExpiresAt(pollDto.getExpiresAt());
        } else {
            // Default expiration: 7 days from now
            poll.setExpiresAt(LocalDateTime.now().plusDays(7));
        }
        
        // Create poll options
        Set<PollOption> options = new HashSet<>();
        for (PollOptionDto optionDto : pollDto.getOptions()) {
            PollOption option = new PollOption();
            option.setText(optionDto.getText());
            option.setPoll(poll);
            options.add(option);
        }
        
        poll.setOptions(options);
        poll = pollRepository.save(poll);
        
        // Update user points
        user.setPoints(user.getPoints() + 5);
        userRepository.save(user);
        
        return mapPollToDto(poll);
    }

    @Transactional
    public PollDto votePoll(Long optionId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        // Find the option
        PollOption option = null;
        Poll poll = null;
        
        for (Poll p : pollRepository.findAll()) {
            for (PollOption o : p.getOptions()) {
                if (o.getId().equals(optionId)) {
                    option = o;
                    poll = p;
                    break;
                }
            }
            if (option != null) break;
        }
        
        if (option == null || poll == null) {
            throw new RuntimeException("Poll option not found");
        }
        
        // Check if poll is still active
        if (poll.getExpiresAt() != null && poll.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Poll has expired");
        }
        
        // Check if user has already voted in this poll
        boolean hasVoted = false;
        for (PollOption o : poll.getOptions()) {
            if (o.getVotes().contains(user)) {
                hasVoted = true;
                break;
            }
        }
        
        if (hasVoted) {
            throw new RuntimeException("User has already voted in this poll");
        }
        
        // Add vote
        option.getVotes().add(user);
        pollRepository.save(poll);
        
        return mapPollToDto(poll);
    }

    public void deletePoll(Long id) {
        pollRepository.deleteById(id);
    }
    
    private PollDto mapPollToDto(Poll poll) {
        PollDto dto = new PollDto();
        dto.setId(poll.getId());
        dto.setQuestion(poll.getQuestion());
        dto.setAuthorId(poll.getUser().getId());
        dto.setAuthorName(poll.getUser().getUsername());
        dto.setCategoryId(poll.getCategory().getId());
        dto.setCategoryName(poll.getCategory().getName());
        dto.setExpiresAt(poll.getExpiresAt());
        dto.setCreatedAt(poll.getCreatedAt());
        
        // Map options
        List<PollOptionDto> optionDtos = poll.getOptions().stream()
                .map(option -> {
                    PollOptionDto optionDto = new PollOptionDto();
                    optionDto.setId(option.getId());
                    optionDto.setText(option.getText());
                    optionDto.setVoteCount(option.getVotes().size());
                    return optionDto;
                })
                .collect(Collectors.toList());
                
        dto.setOptions(optionDtos);
        
        // Calculate total votes
        int totalVotes = optionDtos.stream()
                .mapToInt(PollOptionDto::getVoteCount)
                .sum();
                
        dto.setTotalVotes(totalVotes);
        
        return dto;
    }
}
