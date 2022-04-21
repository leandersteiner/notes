# Adapter

Main.java

```java
package Adapter;

public class Main {
    public static void main(String[] args) {
        GoogleMailServer mailServer = new GoogleMailServer();
        mailServer.buildConnection();
        mailServer.sendEmail("test@gmx.de", "Das ist die erste E-Mail");

        System.out.println();

        MailServer adapterMailServer = new GoogleMailServerAdapter(mailServer);
        adapterMailServer.connectAndSendMail("Hendrik.Schmitz@gmx.de", "Das ist die zweite E-Mail", "Hendrik Schmitz");
    }
}
```

MailServer.java

```java
package Adapter;

public interface MailServer {
    void connectAndSendMail(String recipient, String content, String recipientName);
}
```

GoogleMailServer.java

```java
package Adapter;

public class GoogleMailServer {
    public GoogleMailServer() {
        //GoogleMailServer Objekt vorbereiten...
    }

    public void buildConnection() {
        //Verbindung zu einem Konto aufbauen...
        System.out.println("Verbindung zu Mailkonto erfolgreich aufgebaut...");
    }

    public void sendEmail(String receiverEmail, String content) {
        System.out.println("Die E-Mail wurde an " + receiverEmail + " gesendet...");
        System.out.println("Inhalt: " + content);
    }
}
```

GoogleMailServerAdapter.java

```java
package Adapter;

import java.util.Base64;

public class GoogleMailServerAdapter implements MailServer {
    private GoogleMailServer mailServer;

    public GoogleMailServerAdapter(GoogleMailServer mailServer) {
        this.mailServer = mailServer;
    }

    @Override
    public void connectAndSendMail(String recipient, String content, String recipientName) {
        this.mailServer.buildConnection();
        String encoded = Base64.getEncoder().encodeToString(content.getBytes());
        System.out.println("Email erfolgreich verschlüsselt");
        this.mailServer.sendEmail(recipient, encoded);
        System.out.println("Name des Empfängers: " + recipientName);
    }
}
```