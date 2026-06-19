package com.locpartage.message;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @EntityGraph(attributePaths = {"expediteur", "destinataire", "annonce"})
    @Query("""
        select m from Message m
        where (m.expediteur.id = :userId or m.destinataire.id = :userId)
        order by m.createdAt desc
        """)
    List<Message> findConversationsByUserId(@Param("userId") Long userId);

    @EntityGraph(attributePaths = {"expediteur", "destinataire", "annonce"})
    @Query("""
        select m from Message m
        where (m.expediteur.id = :user1 and m.destinataire.id = :user2)
           or (m.expediteur.id = :user2 and m.destinataire.id = :user1)
        order by m.createdAt asc
        """)
    List<Message> findThread(@Param("user1") Long user1, @Param("user2") Long user2);
}
