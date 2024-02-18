def get_pathfinding_endpoints(save):
    cur_state = 0  # 0 is no set, 1 is set start, 2 is set goal.
    # There should be an easier way to do this, but this works for now

    SIZE_CONSTANT = save.size

    start_circle_pos = None
    end_circle_pos = None
    layout = [

        [
            sg.Column(
                [[
                    sg.Graph(canvas_size=(500, 500), graph_top_right=(SIZE_CONSTANT, 0),
                             graph_bottom_left=(0, SIZE_CONSTANT),  # background_color=None,
                             key="-GraphIN-", enable_events=True, drag_submits=False)
                ]], justification="center")
        ],
        [
            sg.Text("Current Start Position:"),
            sg.Input(default_text="None", key="-StartOUT-", disabled=True),
            sg.Button("Set", key="-StartIN-", enable_events=True)
        ],
        [
            sg.Text("Current Goal Position:"),
            sg.Input(default_text="None", key="-GoalOUT-", disabled=True),
            sg.Button("Set", key="-GoalIN-", enable_events=True)
        ],
        [
            sg.Combo(["Moon Texture", "Slopemap", "Heightkey"], default_value="Moon Texture",
                     enable_events=True, key="-Map-"),
            sg.Checkbox("Add comm checkpoints?", default=False, key="-CommIN-"),
            sg.OK("Submit", key="-Submit-")
        ]
    ]

    window = sg.Window("A* UI", layout, finalize=True)
    window["-GraphIN-"].draw_image(save.interface_texture_image, location=(0, 0))

    while True:
        event, values = window.read(timeout=500)

        if event == "-Map-":
            map_canvas = values["-Map-"]

            if map_canvas == 'Moon Texture':
                window["-GraphIN-"].draw_image(save.interface_texture_image, location=(0, 0))
            elif map_canvas == 'Slopemap':
                window["-GraphIN-"].draw_image(save.interface_slopemap_image, location=(0, 0))
            elif map_canvas == 'Heightkey':
                window["-GraphIN-"].draw_image(save.interface_heightkey_image, location=(0, 0))
            if start_circle_pos is not None:
                window["-GraphIN-"].draw_circle(start_circle_pos, radius=10, fill_color="blue")
            if end_circle_pos is not None:
                window["-GraphIN-"].draw_circle(end_circle_pos, radius=10, fill_color="blue")

        if event == "-StartIN-":
            cur_state = 1

        if event == "-GoalIN-":
            cur_state = 2

        if event == "-GraphIN-":
            mouse_pos = values["-GraphIN-"]
            if cur_state == 1:
                window["-StartOUT-"].update(value=mouse_pos)
                start_circle_pos = mouse_pos
                map_canvas = values["-Map-"]

                if map_canvas == 'Moon Texture':
                    window["-GraphIN-"].draw_image(save.interface_texture_image, location=(0, 0))
                elif map_canvas == 'Slopemap':
                    window["-GraphIN-"].draw_image(save.interface_slopemap_image, location=(0, 0))
                elif map_canvas == 'Heightkey':
                    window["-GraphIN-"].draw_image(save.interface_heightkey_image, location=(0, 0))
                if start_circle_pos is not None:
                    window["-GraphIN-"].draw_circle(start_circle_pos, radius=10, fill_color="blue")
                if end_circle_pos is not None:
                    window["-GraphIN-"].draw_circle(end_circle_pos, radius=10, fill_color="blue")

                window["-GraphIN-"].draw_circle(start_circle_pos, radius=10, fill_color="blue")
                cur_state = 0

            if cur_state == 2:
                window["-GoalOUT-"].update(value=mouse_pos)
                end_circle_pos = mouse_pos
                map_canvas = values["-Map-"]

                if map_canvas == 'Moon Texture':
                    window["-GraphIN-"].draw_image(save.interface_texture_image, location=(0, 0))
                elif map_canvas == 'Slopemap':
                    window["-GraphIN-"].draw_image(save.interface_slopemap_image, location=(0, 0))
                elif map_canvas == 'Heightkey':
                    window["-GraphIN-"].draw_image(save.interface_heightkey_image, location=(0, 0))
                if start_circle_pos is not None:
                    window["-GraphIN-"].draw_circle(start_circle_pos, radius=10, fill_color="blue")
                if end_circle_pos is not None:
                    window["-GraphIN-"].draw_circle(end_circle_pos, radius=10, fill_color="blue")

                window["-GraphIN-"].draw_circle(end_circle_pos, radius=10, fill_color="blue")
                cur_state = 0

        if event == sg.WIN_CLOSED or event == "Exit":
            window.close()
            raise TypeError("You closed A*")

        if event == "-Submit-":
            if are_you_sure("Endpoint Submission", "Are you sure these are the points you want?"):
                if values["-StartOUT-"] != "None" and values["-GoalOUT-"] != "None":
                    window.close()
                    return eval(values["-StartOUT-"]), eval(values["-GoalOUT-"]), bool(values["-CommIN-"])
                else:
                    show_error("Incomplete Data Error", "Please select a start and end point")
