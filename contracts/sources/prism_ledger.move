module prism::prism_ledger {
    use std::signer;
    use std::string::String;
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};

    struct DocumentRecord has store, copy, drop {
        doc_hash: vector<u8>,
        storage_pointer: String,
        timestamp: u64,
    }

    struct UserVault has key {
        key_envelope: String,
        documents: Table<String, DocumentRecord>,
    }

    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_DOC_NOT_FOUND: u64 = 3;

    public entry fun init_vault(account: &signer) {
        let addr = signer::address_of(account);
        assert!(!exists<UserVault>(addr), E_ALREADY_INITIALIZED);
        move_to(account, UserVault {
            key_envelope: std::string::utf8(b""),
            documents: table::new(),
        });
    }

    public entry fun set_key_envelope(account: &signer, envelope: String) acquires UserVault {
        let addr = signer::address_of(account);
        if (!exists<UserVault>(addr)) {
            move_to(account, UserVault {
                key_envelope: envelope,
                documents: table::new(),
            });
        } else {
            let vault = borrow_global_mut<UserVault>(addr);
            vault.key_envelope = envelope;
        };
    }

    public entry fun anchor_document(
        account: &signer,
        doc_id: String,
        doc_hash: vector<u8>,
        storage_pointer: String,
    ) acquires UserVault {
        let addr = signer::address_of(account);
        if (!exists<UserVault>(addr)) {
            move_to(account, UserVault {
                key_envelope: std::string::utf8(b""),
                documents: table::new(),
            });
        };
        let vault = borrow_global_mut<UserVault>(addr);
        let record = DocumentRecord {
            doc_hash,
            storage_pointer,
            timestamp: timestamp::now_seconds(),
        };
        table::upsert(&mut vault.documents, doc_id, record);
    }

    #[view]
    public fun get_key_envelope(user: address): String acquires UserVault {
        assert!(exists<UserVault>(user), E_NOT_INITIALIZED);
        borrow_global<UserVault>(user).key_envelope
    }

    #[view]
    public fun get_document(user: address, doc_id: String): (vector<u8>, String, u64) acquires UserVault {
        assert!(exists<UserVault>(user), E_NOT_INITIALIZED);
        let vault = borrow_global<UserVault>(user);
        assert!(table::contains(&vault.documents, doc_id), E_DOC_NOT_FOUND);
        let doc = table::borrow(&vault.documents, doc_id);
        (doc.doc_hash, doc.storage_pointer, doc.timestamp)
    }
}
