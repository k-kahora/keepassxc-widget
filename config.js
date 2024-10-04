const database="/home/malcolm/Documents/PassDatabase/Passwords.kdbx"

let base_dir = ""

const pass = Utils.exec('secret-tool lookup xc 1')


const PasswordEntry = entry => Widget.Button({
    on_clicked: () => {
	print(entry)
    },
    attribute: { entry },
    child: Widget.Label({
	        class_name: "title",
                label: entry,
                xalign: 0,
                vpack: "center",
                truncate: "end",
    })
    
})


const PasswordLauncher = ({ width = 500, height = 500, spacing = 12 }) => {
    
    const exec_str = `bash -c "echo ${pass} | keepassxc-cli ls ${database}"`
    const entrys = Utils.exec(exec_str).split('\n').map(PasswordEntry) // returns string
    
    const list = Widget.Box({
        vertical: true,
        children: entrys,
    })
    
    // When a directory is selected, repopulate with that directory info, and then on the next run use that directory as a jumping point like `Store/huckberry`
    function repopulate() {
    const exec_str = `bash -c "echo ${pass} | keepassxc-cli ls ${database} ${base_dir}"`
    const entrys = Utils.exec(exec_str).split('\n').map(PasswordEntry) // returns string
	list.children = entrys;
    
    
    }


    const entry = Widget.Entry({

	hexpand: true,
	css: `margin-bottom: ${spacing}px;`,
        on_change: ({ text }) => entrys.forEach(item => {
            item.visible = item.attribute.entry.match(text ?? "")
        }),
        on_accept: () => {
            // make sure we only consider visible (searched for) applications
	    const results = entrys.filter((item) => item.visible);
            if (results[0]) {
                // App.toggleWindow(WINDOW_NAME)
                // results[0].attribute.app.launch()
		let selected = base_dir + results[0].attribute.entry
		if (selected.endsWith('/'))
		  {
		      base_dir = selected
		      repopulate()
		  }
		else
		{

		    Utils.execAsync(['bash', '-c', `secret-tool lookup xc 1 | keepassxc-cli clip ~/Documents/PassDatabase/Passwords.kdbx "${selected}"` ]).then(out => print(out)).catch(err => print(err))
		    App.toggleWindow('pass-launcher')
		}
            }
        },
    })
    
    App.addIcons(`${App.configDir}/assets`)   

    const lock = Widget.Icon({
	icon: "lock-symbolic",
	size: 200,
    })

    return Widget.Box({
        vertical: true,
        // css: `margin: ${spacing * 2}px;`,
	class_name: "container",
        children: [
	    lock,
            entry,

            // wrap the list in a scrollable
            // Widget.Scrollable({
            //     hscroll: "never",
            //     css: `min-width: ${width}px;`
            //         + `min-height: ${height}px;`,
            //     child: list,
            // }),
            Widget.Scrollable({
                hscroll: "never",
                css: `min-width: ${width}px;`
                    + `min-height: ${height}px;`,
                child: list,
            }),
        ],
        // setup: self => self.hook(App, (_, windowName, visible) => {
        //     if (windowName !== WINDOW_NAME)
        //         return

        //     // when the applauncher shows up
        //     if (visible) {
        //         repopulate()
        //         entry.text = ""
        //         entry.grab_focus()
        //     }
        // }),
    })
}



const window = Widget.Window({
    name: 'pass-launcher',
    exclusivity: 'normal',
    keymode: 'on-demand',
    layer: 'top',
    margins: [0, 6],
    setup: self => self.keybind("Escape", () => {
        App.closeWindow(`pass-launcher`)
    }),
    monitor: 1,
    child: PasswordLauncher({
        width: 500,
        height: 500,
        spacing: 12,
    }),
})



App.config({
    style: "./style.css",
    windows: [
	window

        // you can call it, for each monitor
        // Bar(0),
        // Bar(1)
    ],
})
