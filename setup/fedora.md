# Fedora setup

## Initial

```
sudo dnf update -y
reboot
sudo dnf install \
  https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm
 sudo dnf install \
  https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
echo 'fastestmirror=1' | sudo tee -a /etc/dnf/dnf.conf
echo 'max_parallel_downloads=10' | sudo tee -a /etc/dnf/dnf.conf
echo 'deltarpm=true' | sudo tee -a /etc/dnf/dnf.conf
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
sudo dnf install gstreamer1-plugins-{bad-\*,good-\*,base} gstreamer1-plugin-openh264 gstreamer1-libav --exclude=gstreamer1-plugins-bad-free-devel
sudo dnf install lame\* --exclude=lame-devel
sudo dnf group upgrade --with-optional Multimedia
sudo dnf install vlc
sudo dnf install fedora-workstation-repositories
sudo dnf config-manager --set-enabled google-chrome
sudo dnf install google-chrome-stable
sudo hostnamectl set-hostname xps15
sudo dnf install gnome-tweaks gnome-extensions-app
reboot
sudo dnf install -y akmod-nvidia
modinfo -F version nvidia
sudo dnf upgrade --refresh
sudo dnf check
sudo dnf autoremove
sudo fwupdmgr get-devices
sudo fwupdmgr refresh --force
sudo fwupdmgr get-updates
sudo fwupdmgr update
sudo reboot now
sudo dnf install util-linux-user
sudo dnf install zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
sudo dnf install -y gnome-shell-extension-appindicator
sudo dnf upgrade --refresh
sudo dnf groupupdate core
sudo dnf install -y rpmfusion-free-release-tainted
sudo dnf install -y dnf-plugins-core
ssh-keygen -t ed25519
sudo dnf install gh
git config --global user.name "Leander Steiner"
git config --global user.email leandersteiner@yahoo.de
git config --global core.editor vim
git config --global init.defaultbranch main
gh auth login
sudo dnf install -y gnome-shell-extension-pop-shell
flatpak install -y flatseal
sudo dnf install -y gcc gcc-g++ boost-devel
sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
sudo sh -c 'echo -e "[code]\nname=Visual Studio Code\nbaseurl=https://packages.microsoft.com/yumrepos/vscode\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/vscode.repo'
dnf check-update
sudo dnf install code
```

## Development

### Docker

```
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager \
    --add-repo \
    https://download.docker.com/linux/fedora/docker-ce.repo
sudo dnf install docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER
sudo systemctl enable docker.service
sudo systemctl enable containerd.service
```

### Go

```
sudo tar -C /usr/local -xzf go1.18.4.linux-amd64.tar.gz
```

### Node

```
curl -sL https://rpm.nodesource.com/setup_18.x | sudo -E bash -
sudo dnf install nodejs
```

### Rust

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Dotnet

```
sudo dnf install dotnet-sdk-6.0
```

### Java

```
sudo dnf install java-latest-openjdk-devel
```

## Config

### .zshrc

```
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias mkdir='mkdir -p'
alias vim='nvim'

export JAVA_HOME=/usr/lib/jvm/java-18-openjdk-18.0.1.1.2-1.rolling.fc36.x86_64

export PATH=$PATH:/usr/local/go/bin
export PATH=$PATH:~/go/bin
export PATH=$PATH:$HOME/.local/bin
export PATH=$PATH:/opt/gradle/gradle-7.5/bin
export PATH=$PATH:/opt/maven/maven-3.8.6/bin
```
