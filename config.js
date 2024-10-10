import Gdk from "gi://Gdk";
const GLib = imports.gi.GLib;

let database = GLib.getenv("KEEPASSXC_DB");


if (database !== null) {
  print(`Environment variable: ${database}`);
} else {
  print("Environment variable not found");
}


App.addIcons(`${App.configDir}/assets`);

let base_dir = "";

let username_toggle = false;

let pass_or_username = Variable("password");

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

  const fixed = Widget.Fixed({
    setup(self) {
      self.put(Widget.Label({ label: pass_or_username.bind() }), 280, 100);
    },
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
            `secret-tool lookup xc 1 | keepassxc-cli clip -a "${pass_or_username.value}" "${database}" "${selected}"`,
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

  let lock_test = Widget.Button({
    class_name: "lock-icon",
    css: `min-width: 128px; min-height: 256px;`,
    on_clicked: (self) => {
      Utils.exec(`secret-tool clear xc 1`);
      pop_up.value = PasswordLauncher(
        {
          width: 500,
          height: 500,
          spacing: 12,
        },
        false,
        false,
      );
    },
  });

  const locked = Widget.Box({
    class_name: "lock-closed",
    css: `min-width: 128px; min-height: 256px;`,
  });

  if (!scrollable) {
    lock_test = locked;
  }

  let box_file_select = Widget.Box({
    child: Widget.FileChooserButton({
      onFileSet: ({ uri }) => {
        let cleanedUrl = uri.replace(/^file:\/\//, "");
        database = cleanedUrl;
      },
    }),

    css: `min-width: 200px; min-height: 200px; padding: 20px`,
  });
  let file_or_scroll = scrollable ? scroll : box_file_select;
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
      file_or_scroll,

      Widget.Box({ css: `min-height: 80px` }),
    ],
    vertical: true,
  });

  const main_container = Widget.Box({
    vertical: true,
    class_name: username_toggle ? "password-bg" : "container",
    css: `min-width: 200px; min-height: 200px; padding-left: 55px; padding-right: 55px;`,
    children: [flow_box],
  }).on("key-press-event", (self, event) => {
    let keyval = event.get_keyval();
    let state = event.get_state();

    print(state[1] & Gdk.ModifierType.CONTROL_MASK);
    if (state[1] & Gdk.ModifierType.CONTROL_MASK && keyval[1] === Gdk.KEY_g) {
      username_toggle = !username_toggle;
      pass_or_username.value = username_toggle ? "username" : "password";
      self.class_name = username_toggle ? "password-bg" : "container";
    }
    if (state[1] & Gdk.ModifierType.CONTROL_MASK && keyval[1] === Gdk.KEY_r) {
      base_dir = "";
      repopulate();
    }
  });

  return Widget.Overlay({
    pass_through: true,
    overlays: [fixed],
    child: main_container,
  });
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
