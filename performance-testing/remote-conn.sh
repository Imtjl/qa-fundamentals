# -f: SSH-session in the background
# -N: don't do remote commands (for tunneling)
# -L: Local tunnel 8080 (remote) -> ssh tunnel -> 8083 (local)
ssh -f -N -L 8083:stload.se.ifmo.ru:8080 s368090@helios.cs.ifmo.ru -p 2222
