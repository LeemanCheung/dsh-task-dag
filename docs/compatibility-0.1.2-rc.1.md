# DSH 0.1.2-rc.1 compatibility

Verified on Windows with DSH `0.1.2-rc.1` on 2026-09-05.

## Verified

- The package installed and its Host projection and Client bundle activated in real DSH Web Profiles.
- Existing local session history remained readable after the DSH upgrade.
- The Task DAG package activated in the real `127.0.0.1:3080` profile. Two rc.1 UI migrations were then made from live evidence: `conversationEvents` to `uiConversation.events`, and Session-embedded Chat data to `useConversation(...views.get('chat'))`.
- The upgraded plugin inventory and statistics loaded in the separate `127.0.0.1:3081` QA Profile.
- The Client registers Team snapshot definitions through the DSH 0.1.2 `ctx.uiConversation.events` registry. The removed `conversationEvents` service is no longer requested.
- Session navigation and header-slot registration use the DSH 0.1.2 Session Controller and UI Renderer services.
- DAG nodes read the Chat target through the Session-standard `useConversation` hook and `views.get('chat')`; they no longer assume Chat data lives inside the Session lifecycle snapshot.

## Preserved behavior

- Provider and model values come only from recorded DSH request headers.
- A concrete reasoning effort appears only when the request records one. Missing effort remains “Not recorded” rather than inheriting a guessed default.
- Public model defaults remain a separately labelled reference and never replace the recorded request value.
- Team task dependencies, communication links, Workflow phase groups, and missing Workflow source code retain their existing meanings.

## Compatibility boundary

`compatible` means the projection, Client services, existing-history reads, and Session-header action registration work with DSH `0.1.2-rc.1`. It does not claim that every configured model Provider can authenticate or complete a request. A Provider OAuth failure does not change this DSH interface result.

The shared upgraded runtime completed a real root-plus-one-child request at 13:11 on 2026-09-05. The root and child returned `ROOT_OK_0905` and `CHILD_OK_0905:42`; the session recorded two rounds, three steps, and a successful round with about 66K input Tokens, 152 output Tokens, and `High` as the current reasoning effort. This proves the shared DSH model and child-session path. The final DAG button and child tooltip still require a page refresh after the last Client bundle rebuild before their visual result is recorded.
