package com.locpartage.message;

import com.locpartage.message.dto.MessageDto;

public final class MessageMapper {
    private MessageMapper() {}

    public static MessageDto toDto(Message m) {
        return new MessageDto(
                m.getId(),
                m.getExpediteur().getId(),
                m.getExpediteur().getPrenom() + " " + m.getExpediteur().getNom(),
                m.getDestinataire().getId(),
                m.getDestinataire().getPrenom() + " " + m.getDestinataire().getNom(),
                m.getAnnonce() != null ? m.getAnnonce().getId() : null,
                m.getContenu(),
                m.isLu(),
                m.getCreatedAt()
        );
    }
}
