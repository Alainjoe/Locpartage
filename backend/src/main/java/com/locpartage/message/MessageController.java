package com.locpartage.message;

import com.locpartage.annonce.AnnonceRepository;
import com.locpartage.common.NotFoundException;
import com.locpartage.message.dto.MessageDto;
import com.locpartage.message.dto.MessageRequest;
import com.locpartage.security.CurrentUser;
import com.locpartage.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageRepository repo;
    private final UserRepository userRepo;
    private final AnnonceRepository annonceRepo;
    private final CurrentUser current;

    public MessageController(MessageRepository r, UserRepository u, AnnonceRepository a, CurrentUser c) {
        this.repo = r;
        this.userRepo = u;
        this.annonceRepo = a;
        this.current = c;
    }

    @PostMapping
    public ResponseEntity<MessageDto> send(@Valid @RequestBody MessageRequest req) {
        var dest = userRepo.findById(req.destinataireId())
                .orElseThrow(() -> new NotFoundException("Destinataire introuvable"));
        Message m = Message.builder()
                .expediteur(current.get())
                .destinataire(dest)
                .annonce(req.annonceId() != null ? annonceRepo.findById(req.annonceId()).orElse(null) : null)
                .contenu(req.contenu())
                .lu(false)
                .build();
        return ResponseEntity.ok(MessageMapper.toDto(repo.save(m)));
    }

    @GetMapping
    public List<MessageDto> mine() {
        return repo.findConversationsByUserId(current.getId()).stream().map(MessageMapper::toDto).toList();
    }

    @GetMapping("/thread/{otherUserId}")
    @Transactional
    public List<MessageDto> thread(@PathVariable Long otherUserId) {
        Long currentUserId = current.getId();
        List<Message> messages = repo.findThread(currentUserId, otherUserId);
        messages.stream()
                .filter(m -> m.getDestinataire().getId().equals(currentUserId))
                .forEach(m -> m.setLu(true));
        return messages.stream().map(MessageMapper::toDto).toList();
    }
}
