import Gdk from "gi://Gdk";

const database = "/home/malcolm/Documents/PassDatabase/Passwords.kdbx";

App.addIcons(`${App.configDir}/assets`);

let base_dir = "";

let username_toggle = false;

const fontbutton = Widget.FontButton({
  onFontSet: ({ font }) => {
    print(font);
  },
});

// If secret-tool lookup xc 1 is null
// Prompt for the Password
// Set the password to the database

// Pass new icon to this, scrollable section, and entry as a parameter to this function for sectret lookup

const PasswordLauncher = (
  { width = 500, height = 500, spacing = 12 },
  entry_bool,
  scrollable,
) => {
  const PasswordEntry = (entry) =>
    Widget.Button({
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

  const pass = Utils.exec(`bash -c "secret-tool lookup xc 1"`);

  const exec_str = `bash -c "echo ${pass} | keepassxc-cli ls ${database}"`;
  let entrys = Variable(Utils.exec(exec_str).split("\n").map(PasswordEntry)); // returns string

  let outline = Widget.Icon({
    icon: "border",
    // size: 200,
  });

  let list = Widget.Box({
    vertical: true,
    children: entrys.bind(),
  });

  const scroll = Widget.Scrollable({
    hscroll: "never",
    css: `min-width: 200px; min-height: 200px; padding: 20px`,
    child: list,
  });

  // When a directory is selected, repopulate with that directory info
  function repopulate() {
    const exec_str = `bash -c "echo ${pass} | keepassxc-cli ls ${database} ${base_dir}"`;
    const newEntries = Utils.exec(exec_str).split("\n").map(PasswordEntry);

    // Clear the existing children safely
    entry.text = "";
    entrys.value = newEntries;
  }

  const password_entry = Widget.Entry({
    hexpand: true,
    on_accept: ({ text }) => {
      Utils.exec(
        `bash -c "echo ${text} | secret-tool store --label='db' xc 1"`,
      );
      pop_up.value = PasswordLauncher(
        {
          width: 500,
          height: 500,
          spacing: 12,
        },
        true,
        true,
      );
    },
  });

  let entry = Widget.Entry({
    hexpand: true,
    placeholder_text: "Password Lookup",
    on_change: ({ text }) =>
      entrys.value.forEach((item) => {
        item.visible = item.attribute.entry.match(text ?? "");
      }),
    on_accept: () => {
      const results = entrys.value.filter((item) => item.visible);
      if (results[0]) {
        let selected = base_dir + results[0].attribute.entry;
        if (selected.endsWith("/")) {
          base_dir = selected;

          repopulate();
        } else {
          Utils.execAsync([
            "bash",
            "-c",
            `secret-tool lookup xc 1 | keepassxc-cli clip ~/Documents/PassDatabase/Passwords.kdbx "${selected}"`,
          ])
            .then((out) => print(out))
            .catch((err) => print(err));
          App.toggleWindow("pass-launcher");
        }
      }
    },
  });

  if (!entry_bool) {
    entry = password_entry;
  }

  let toggle = Widget.Box({
    class_name: "username-toggle",
    css: `min-width: 128px; min-height: 128px;`,
  });

  let lock_test = Widget.Box({
    class_name: "lock-icon",
    css: `min-width: 128px; min-height: 256px;`,
  });

  const locked = Widget.Box({
    class_name: "lock-closed",
    css: `min-width: 128px; min-height: 256px;`,
  });

  if (!scrollable) {
    lock_test = locked;
  }

  let box_b = Widget.Box({
    child: Widget.FileChooserButton({}),

    css: `min-width: 200px; min-height: 200px; padding: 20px`,
  });
  if (scrollable) {
    box_b = scroll;
  }
  const flow_box = Widget.Box({
    children: [
      Widget.Box({
        children: [
          lock_test,
          Widget.Box({
            children: [Widget.Box({ css: `min-height: 150px; ` }), entry],
            vertical: true,
          }),
        ],
      }),
      box_b,

      Widget.Box({ css: `min-height: 80px` }),
    ],
    vertical: true,
  });

  const main_container = Widget.Box({
    vertical: true,
    class_name: "container",
    css: `min-width: 200px; min-height: 200px; padding-left: 55px; padding-right: 55px;`,
    children: [flow_box],
  }).on("key-press-event", (self, event) => {
    let keyval = event.get_keyval();
    let state = event.get_state();

    print(state[1] & Gdk.ModifierType.CONTROL_MASK);
    if (state[1] & Gdk.ModifierType.CONTROL_MASK && keyval[1] === Gdk.KEY_a) {
      username_toggle = !username_toggle;
      self.class_name = username_toggle ? "password-bg" : "container";
    }
  });

  return main_container;
};

function secret_tool_check() {
  const result = Utils.exec(`bash -c "secret-tool lookup xc 1"`);
  if (result) {
    return PasswordLauncher(
      {
        width: 500,
        height: 500,
        spacing: 12,
      },
      true,
      true,
    );
  } else {
    return PasswordLauncher(
      {
        width: 500,
        height: 500,
        spacing: 12,
      },
      false,
      false,
    );
  }
}

// function secret_tool_check() {
//   const result = Utils.exec(`bash -c "secret-tool lookup xc 1"`);

//   if (result) {
//     return PasswordLauncher(
//       {
//         width: 500,
//         height: 500,
//         spacing: 12,
//         section: true,
//       },
//       good_entry,
//     );
//   } else {
//     const entry = Widget.Entry({
//       hexpand: true,
//       on_accept: ({ text }) => {
//         Utils.exec(
//           `bash -c "echo ${text} | secret-tool store --label='db' xc 1"`,
//         );
//         pop_up.value = PasswordLauncher(
//           {
//             width: 500,
//             height: 500,
//             spacing: 12,
//             section: true,
//           },
//           good_entry,
//         );
//       },
//     });

//     return PasswordLauncher(
//       {
//         width: 600,
//         height: 500,
//         spacing: 12,
//         section: false,
//       },
//       entry,
//     );
//   }
// }

const pop_up = Variable(secret_tool_check());

const window = Widget.Window({
  name: "pass-launcher",
  exclusivity: "normal",
  keymode: "on-demand",
  layer: "top",
  margins: [0, 6],
  setup: (self) =>
    self.keybind("Escape", () => {
      App.closeWindow("pass-launcher");
    }),
  monitor: 1,
  child: Widget.Box({
    css: `min-width: 512px; min-height: 512px;`,
    child: pop_up.bind(),
  }),
});

App.config({
  style: "./style.css",
  windows: [window],
});
