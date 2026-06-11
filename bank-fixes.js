(function () {
  const bank = window.CCNA_QUESTIONS || [];
  const fixes = new Map([
    [28, {
      question: "Reportez-vous à l’illustration. Quelle route statique un technicien informatique doit-il saisir pour créer une route de secours vers le réseau 172.16.1.0 qui sera utilisée uniquement en cas de défaillance de la route principale associée à RIP ?",
      options: [
        "ip route 172.16.1.0 255.255.255.0 s0/0/0 121",
        "ip route 172.16.1.0 255.255.255.0 s0/0/0 111",
        "ip route 172.16.1.0 255.255.255.0 s0/0/0 91",
        "ip route 172.16.1.0 255.255.255.0 s0/0/0",
      ],
      correct: [0],
      type: "single",
      expectedChoices: 1,
    }],
    [39, {
      question: "Examinez l’illustration. Un ingénieur réseau configure le routage IPv6 sur le réseau. Quelle commande exécutée sur le routeur HQ permet de configurer une route par défaut vers Internet en vue de transférer les paquets vers un réseau de destination IPv6 qui n’est pas répertorié dans la table de routage ?",
      options: [
        "ipv6 route ::/0 serial 0/0/0",
        "ipv6 route ::/0 serial 0/1/1",
        "ipv6 route ::1/0 serial 0/1/1",
        "ip route 0.0.0.0 0.0.0.0 serial 0/1/1",
      ],
      correct: [1],
      type: "single",
      expectedChoices: 1,
    }],
    [41, {
      question: "Quelle réponse indique une route statique par défaut IPv4 correctement configurée ?",
      options: [
        "ip route 0.0.0.0 255.255.255.255 S0/0/0",
        "ip route 0.0.0.0 255.255.255.0 S0/0/0",
        "ip route 0.0.0.0 255.0.0.0 S0/0/0",
        "ip route 0.0.0.0 0.0.0.0 S0/0/0",
      ],
      correct: [3],
      type: "single",
      expectedChoices: 1,
    }],
    [42, {
      question: "Reportez-vous à l’illustration. Quelle commande de route statique peut être entrée sur R1 pour transférer le trafic vers le réseau local connecté à R2 ?",
      options: [
        "ipv6 route 2001:db8:12:10::/64 S0/0/0 fe80::2",
        "ipv6 route 2001:db8:12:10::/64 S0/0/1 2001:db8:12:10::1",
        "ipv6 route 2001:db8:12:10::/64 S0/0/0",
        "ipv6 route 2001:db8:12:10::/64 S0/0/1 fe80::2",
      ],
      correct: [3],
      type: "single",
      expectedChoices: 1,
    }],
    [89, {
      question: "Reportez-vous à l’illustration. Actuellement, le routeur R1 utilise une route EIGRP enregistrée via Branch2 pour atteindre le réseau 10.10.0.0/16. Quelle route statique flottante crée une route de secours vers le réseau 10.10.0.0/16 au cas où la liaison entre R1 et Branch2 serait interrompue ?",
      options: [
        "ip route 10.10.0.0 255.255.0.0 Serial 0/0/0 100",
        "ip route 10.10.0.0 255.255.0.0 209.165.200.226 100",
        "ip route 10.10.0.0 255.255.0.0 209.165.200.225 100",
        "ip route 10.10.0.0 255.255.0.0 209.165.200.225 50",
      ],
      correct: [2],
      type: "single",
      expectedChoices: 1,
    }],
    [104, {
      question: "Quelle commande permet de lancer le processus de regroupement de deux interfaces physiques afin de créer un groupe EtherChannel par le biais du protocole LACP ?",
      options: [
        "channel-group 1 mode desirable",
        "interface range GigabitEthernet 0/4 – 5",
        "channel-group 2 mode auto",
        "interface port-channel 2",
      ],
      correct: [1],
      type: "single",
      expectedChoices: 1,
    }],
    [133, {
      options: [
        "Adresse IP",
        "Domaine VTP",
        "lignes vty",
        "VLAN par défaut",
        "passerelle par défaut",
        "adresse de bouclage",
      ],
      correct: [0, 2, 4],
      explanation: "Pour activer l’accès de gestion à distance, le commutateur doit disposer d’une adresse IP, d’une passerelle par défaut et de lignes VTY configurées pour Telnet ou SSH.",
      type: "multi",
      expectedChoices: 3,
    }],
    [145, {
      question: "Un nouveau commutateur de couche 3 est connecté à un routeur et est en cours de configuration pour le routage inter-VLAN. Quelles sont trois des cinq étapes requises pour la configuration ? (Choisissez trois réponses.)",
      options: [
        "modifier le VLAN par défaut",
        "installer une route statique",
        "ajustement de la métrique d’itinéraire",
        "création de VLAN",
        "attribution de ports aux VLAN",
        "création d’interfaces SVI",
        "implémenter un protocole de routage",
      ],
      correct: [3, 4, 5],
      type: "multi",
      expectedChoices: 3,
    }],
  ]);

  bank.forEach((question) => {
    const fix = fixes.get(question.id);
    if (fix) Object.assign(question, fix);
  });
})();
