build-wasm-dist:
	bash -c " \
		cd src/wasm-frontman && \
		wasm-pack build \
			--target web \
			--out-name wasm-frontman \
			--out-dir ../../src/frontman-wasm \
	"
