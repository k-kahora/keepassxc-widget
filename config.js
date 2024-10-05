const database = "/home/malcolm/Documents/PassDatabase/Passwords.kdbx";

let base_dir = "";


const fontbutton = Widget.FontButton({
  onFontSet: ({ font }) => {
    print(font)
  },
})

// If secret-tool lookup xc 1 is null
// Prompt for the Password 
// Set the password to the database

const PasswordLauncher = ({ width = 500, height = 500, spacing = 12 }) => {

  const PasswordEntry = (entry) => Widget.Button({
    on_clicked: () => {
      print(entry);
    },
    attribute: { entry },
    child: Widget.Label({
      class_name: "title",
      label: entry,
      xalign: 0,
      vpack: "center",
      truncate: "end",
    }),
  });

  const pass = Utils.exec(`bash -c "secret-tool lookup xc 1"`)

  const exec_str = `bash -c "echo ${pass} | keepassxc-cli ls ${database}"`;
  let entrys = Variable(Utils.exec(exec_str).split('\n').map(PasswordEntry)); // returns string

  let list = Widget.Box({
    vertical: true,
    children: entrys.bind()
  });

  // When a directory is selected, repopulate with that directory info
  function repopulate() {
    const exec_str = `bash -c "echo ${pass} | keepassxc-cli ls ${database} ${base_dir}"`;
    const newEntries = Utils.exec(exec_str).split('\n').map(PasswordEntry);

    // Clear the existing children safely
    entry.text = ""
    entrys.value = newEntries

  }

  const entry = Widget.Entry({
    hexpand: true,
    placeholder_text: "Password Lookup",
    css: `margin-bottom: 12px;`,
    on_change: ({ text }) => entrys.value.forEach(item => {
      item.visible = item.attribute.entry.match(text ?? "");
    }),
    on_accept: () => {
      const results = entrys.value.filter((item) => item.visible);
      if (results[0]) {
        let selected = base_dir + results[0].attribute.entry;
        if (selected.endsWith('/')) {
          base_dir = selected;

          repopulate();
        } else {
          Utils.execAsync(['bash', '-c', `secret-tool lookup xc 1 | keepassxc-cli clip ~/Documents/PassDatabase/Passwords.kdbx "${selected}"`])
            .then(out => print(out))
            .catch(err => print(err));
          App.toggleWindow('pass-launcher');
        }
      }
    },
  });

  App.addIcons(`${App.configDir}/assets`);

  const lock = Widget.Icon({
    icon: "lock-symbolic",
    size: 200,
  });





  const main_container =
    Widget.Box({
      vertical: true,
      class_name: "container",
      children: [
        lock,
        entry,
        Widget.Scrollable({
          hscroll: "never",
          css: `min-width: ${width}px; min-height: ${height}px`,
          child: list,
        }),
      ],
    });


  return main_container
}



function secret_tool_check() {
  const result = Utils.exec(`bash -c "secret-tool lookup xc 1"`)
  if (result) {

    return PasswordLauncher({
      width: 500,
      height: 500,
      spacing: 12,
    })

  } else {

    const label = Widget.Label({
      label: 'Enter Database Password',
      justification: 'center',
      truncate: 'end',
      xalign: 0,
      maxWidthChars: 24,
      wrap: true,
      useMarkup: true,
    })

    return Widget.Box({
      css: `min-width: 500px; min-height: 500px;`,
      class_name: "password_entry",
      vertical: true,
      children: [
        label,
        Widget.Entry({
          on_accept: ({ text }) => {
            Utils.exec(`bash -c "echo ${text} | secret-tool store --label='db' xc 1"`);
            pop_up.value =
              PasswordLauncher({
                width: 500,
                height: 500,
                spacing: 12,
              })
          }
        })],
    })
  }
}

const pop_up = Variable(secret_tool_check())

const window = Widget.Window({
  name: 'pass-launcher',
  exclusivity: 'normal',
  keymode: 'on-demand',
  layer: 'top',
  margins: [0, 6],
  setup: self => self.keybind("Escape", () => {
    App.closeWindow('pass-launcher');
  }),
  monitor: 1,
  child: Widget.Box({
    css: `min-width: 500px; min-height: 500px;`,
    child: pop_up.bind()
  })
});

App.config({
  style: "./style.css",
  windows: [window],
});
