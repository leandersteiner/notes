# Linux snippets

## imwheel

### Config

```
".*"
None, Up, Button4, 3
None, Down, Button5, 3
Control_L, Up, Control_L|Button4
Control_L, Down, Control_L|Button5
Shift_L, Up, Shift_L|Button4
Shift_L, Down, Shift_L|Button5
```

### Auto start

`~/.config/autostart/imwheel.desktop`

```
[Desktop Entry]
Name=imwheel
Comment=Imwheel startup
Exec=imwheel
Type=Application
```
